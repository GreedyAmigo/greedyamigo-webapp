import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";

import {apolloProvider, clearApolloClientCache} from "./apollo"

import {
    createFriendMutation,
    createMoneyLendingMutation,
    createThingLendingMutation,
    createThingMutation,
    currenciesQuery,
    deleteMoneyLendingMutation,
    deleteThingLendingMutation,
    meQuery,
    updateMoneyLendingMutation,
    updateThingLendingMutation
} from "./graphql"

import {redirectIfUnauthorized, removeJwt} from "./authentication"

import {
    deepCopyTo,
    generateDeepCopy,
    getCurrencyDisplayValue,
    getFormattedDateString,
    getFriendDisplayName,
    handleGraphQlException,
    MoneyLendingDiscriminator,
    processUserInfo,
    ThingLendingDiscriminator
} from "./data_processing"
import {addNavbarCollapseFunctionality, displayHiddenElements} from "./user_interface";

const POPUP_ADD_MODE = "add";
const POPUP_EDIT_MODE = "edit";
const POPUP_DELETE_MODE = "delete";

redirectIfUnauthorized();

window.onload = function() {
    addNavbarCollapseFunctionality();
    displayHiddenElements();
}

Vue.use(VueApollo);

const initialDataSet = {
    dataFetched: false,
    user: {
        firstName: "",
        lastName: "",
        lendings: [],
        friends: [],
        things: []
    },
    lendingTypes: [
        ThingLendingDiscriminator,
        MoneyLendingDiscriminator
    ],
    popup: {
        addNewFriend: false,
        visible: false,
        mode: "",
        editLending: undefined,
        addNewThing: false,
        errorStore: []
    },
    popupModel: {
        amount: 0,
        description: "",
        dueDate: new Date(),
        isBorrowed: false,
        discriminator: MoneyLendingDiscriminator,
        firstName: "",
        lastName: "",
        friendString: "",
        currencyString: "",
        thingString: "",
        newThingStr: "",
        emoji: ""
    },
    currencies: [],
    errorStore: []
};

let vueApplication = new Vue({
    el: "#dashboard",
    apolloProvider,
    components: {
        Datepicker
    },
    data: generateDeepCopy(initialDataSet),
    methods: {
        resetVueData: function () {
            this.$data = deepCopyTo(initialDataSet, this);
        },
        logOutUser: function () {
            removeJwt();
            clearApolloClientCache();
            redirectIfUnauthorized();
        },
        resetPopUpValues: function () {
            deepCopyTo(initialDataSet.popup, this.popup);
            deepCopyTo(initialDataSet.popupModel, this.popupModel);
        },
        showAddPopup: function () {
            this.resetPopUpValues();

            this.popup.mode = POPUP_ADD_MODE;
            this.popup.visible = true;
        },
        setPopupModel: function (lending) {
            this.resetPopUpValues();

            this.popupModel.cleared = lending.cleared;
            this.popupModel.description = lending.description;

            this.popupModel.dueDate =
                new Date(lending.dueDate.year, lending.dueDate.month, lending.dueDate.day);

            this.popupModel.id = lending.id;
            this.popupModel.isBorrowed = lending.isBorrowed;
            this.popupModel.friendString = getFriendDisplayName(lending.participant);

            this.popupModel.discriminator = lending.discriminator;

            if (this.popupModel.discriminator === MoneyLendingDiscriminator) {
                this.popupModel.amount = lending.amount;
                this.popupModel.currencyString = getCurrencyDisplayValue(lending.currency);
            } else {
                this.popupModel.emoji = lending.emoji;
                this.popupModel.thingString = lending.thing.label;
            }
        },
        showEditPopup: function (lending) {
            this.setPopupModel(lending);

            this.popup.mode = POPUP_EDIT_MODE;
            this.popup.visible = true;
        },
        showDeletePopup: function (lending) {
            this.setPopupModel(lending);

            this.popup.mode = POPUP_DELETE_MODE;
            this.popup.visible = true;
        },
        popupInAddMode: function () {
            return this.popup.mode === POPUP_ADD_MODE;
        },
        popupInEditMode: function () {
            return this.popup.mode === POPUP_EDIT_MODE;
        },
        popupInDeleteMode: function () {
            return this.popup.mode === POPUP_DELETE_MODE;
        },
        hidePopup: function () {
            this.popup.mode = "";
            this.popup.visible = false;
        },
        isNotLastLendingEntry: function (lending) {
            return lending !== this.user.lendings[this.user.lendings.length - 1];
        },
        submitPopup: async function () {
            this.popup.errorStore = [];

            let participantId;

            let newFriend = {
                firstName: this.popupModel.firstName,
                lastName: this.popupModel.lastName
            };

            if (this.popup.addNewFriend
                && !this.popupInDeleteMode()) {
                let matchingFriends =
                    this.user
                        .friends
                        .filter((friend) => {
                            return getFriendDisplayName(newFriend) === getFriendDisplayName(friend)
                        });

                if (matchingFriends.length > 0) {
                    this.popup.errorStore.push("Friend already existing.");
                    return;
                } else {
                    await this.$apollo
                        .mutate({
                            mutation: gql`${createFriendMutation}`,
                            variables: {
                                firstName: this.popupModel.firstName,
                                lastName: this.popupModel.lastName
                            }
                        }).then((data) => {
                            participantId = data.data.createAnonymousUser.id;
                        }).catch((error) => {
                            handleGraphQlException(error, this.popup.errorStore);
                        });
                }
            } else if (!this.popupInDeleteMode()) {
                let matchingFriends =
                    this.user
                        .friends
                        .filter((friend) => {
                            return this.popupModel.friendString === getFriendDisplayName(friend)
                        });

                if (matchingFriends.length > 0) {
                    participantId = matchingFriends[0].id;
                } else {
                    this.popup.errorStore.push("Selected friend not existing.");
                    return;
                }
            }

            let thingId;

            if (this.isThingLending(this.popupModel)
                && !this.popupInDeleteMode()) {
                if (this.popup.addNewThing) {
                    let matchingThings =
                        this.user
                            .things
                            .filter((thing) => {
                                return this.popupModel.newThingStr === thing.label
                            });

                    if (matchingThings.length > 0) {
                        this.popup.errorStore.push("Thing already existing.");
                        return;
                    } else {
                        await this.$apollo
                            .mutate({
                                mutation: gql`${createThingMutation}`,
                                variables: {
                                    label: this.popupModel.newThingStr
                                }
                            }).then((data) => {
                                thingId = data.data.createThing.id;
                            }).catch((error) => {
                                handleGraphQlException(error, this.popup.errorStore);
                            });
                    }
                } else if (!this.popupInDeleteMode()) {
                    let matchingThings =
                        this.user
                            .things
                            .filter((thing) => {
                                return this.popupModel.thingString === thing.label
                            });

                    if (matchingThings.length > 0) {
                        thingId = matchingThings[0].id;
                    } else {
                        this.popup.errorStore.push("Selected thing not existing.");
                        return;
                    }
                }
            }

            let graphQlMutation;
            let graphQlVariables;

            if (this.isThingLending(this.popupModel)) {
                graphQlVariables = {
                    dueDate: getFormattedDateString(this.popupModel.dueDate),
                    description: this.popupModel.description,
                    participantId: participantId,
                    isBorrowed: this.popupModel.isBorrowed,
                    emoji: this.popupModel.emoji,
                    thingId: thingId
                };

                if (this.popupInAddMode()) {
                    graphQlMutation = createThingLendingMutation;
                } else if (this.popupInEditMode()) {
                    graphQlMutation = updateThingLendingMutation;
                } else if (this.popupInDeleteMode()) {
                    graphQlMutation = deleteThingLendingMutation;

                    graphQlVariables = {
                        "thingLendingId": this.popupModel.id
                    };
                }
            } else {
                let currencyId =
                    this.currencies
                        .filter(currency => {
                            return getCurrencyDisplayValue(currency) === this.popupModel.currencyString
                        })[0]
                        .id;

                graphQlVariables = {
                    dueDate: getFormattedDateString(this.popupModel.dueDate),
                    description: this.popupModel.description,
                    participantId: participantId,
                    isBorrowed: this.popupModel.isBorrowed,
                    amount: parseFloat(this.popupModel.amount),
                    currencyId: currencyId
                };

                if (this.popupInAddMode()) {
                    graphQlMutation = createMoneyLendingMutation;
                } else if (this.popupInEditMode()) {
                    graphQlMutation = updateMoneyLendingMutation;
                } else if (this.popupInDeleteMode()) {
                    graphQlMutation = deleteMoneyLendingMutation;

                    graphQlVariables = {
                        "moneyLendingId": this.popupModel.id
                    };
                }
            }

            if (this.popup.mode === POPUP_EDIT_MODE) {
                graphQlVariables["id"] = this.popupModel.id;
                graphQlVariables["cleared"] = this.popupModel.cleared;
            }

            await this.$apollo
                .mutate({
                    mutation: gql`${graphQlMutation}`,
                    variables: graphQlVariables
                }).catch((error) => {
                    handleGraphQlException(error, this.popup.errorStore);
                });

            if (this.popup.errorStore.length === 0) {
                this.hidePopup();

                this.resetVueData();
                clearApolloClientCache();

                this.fetchUserData();
            }
        },
        getCurrencyString: function (currency) {
            return getCurrencyDisplayValue(currency);
        },
        getFriends: function () {
            return this.user
                .friends
                .map((friend) => getFriendDisplayName(friend, friend))
                .sort();
        },
        getThings: function () {
            return this.user
                .things
                .map((thing) => thing.label)
                .sort();
        },
        isMoneyLending: function (lending) {
            return lending.discriminator === MoneyLendingDiscriminator;
        },
        isThingLending: function (lending) {
            return lending.discriminator === ThingLendingDiscriminator;
        },
        isNewThingLending: function (lending) {
            return this.isThingLending(lending)
                && this.popup.addNewThing === true;
        },
        isOldThingLending: function (lending) {
            return this.isThingLending(lending)
                && this.popup.addNewThing === false;
        },
        getMoneyLendingEmoji: function () {
            return '💵';
        },
        fetchUserData: function () {
            this.$apollo
                .query({
                    query: gql`${meQuery}`
                }).then((data) => {
                this.user.firstName = data.data.me.firstName;
                this.user.lastName = data.data.me.lastName;
                this.user.things = data.data.me.things;
                this.user.friends = data.data.me.anonymousUsers;

                let allUnprocessedLendings =
                    data.data.me.moneyLendings
                        .concat(data.data.me.thingLendings);

                this.user.lendings = processUserInfo(allUnprocessedLendings);

                this.dataFetched = true;
            }).catch((error) => {
                handleGraphQlException(error, this.errorStore);
            });

            this.$apollo
                .query({
                    query: gql`${currenciesQuery}`
                }).then((data) => {
                this.currencies = data.data.currencies;
            }).catch((error) => {
                handleGraphQlException(error, this.errorStore);
            });
        }
    },
    beforeMount() {
        this.fetchUserData();
    }
});