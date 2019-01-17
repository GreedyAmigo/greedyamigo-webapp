import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";

import {
    apolloProvider,
    clearApolloClientCache
} from "./apollo"

import {
    currenciesQuery,
    meQuery,
    createMoneyLendingMutation,
    createThingLendingMutation,
    createThingMutation,
    createFriendMutation
} from "./graphql"

import {
    redirectIfUnauthorized,
    removeJwt
} from "./authentication"

import {
    processUserInfo,
    MoneyLendingDiscriminator,
    ThingLendingDiscriminator,
    getFriendDisplayName,
    getCurrencyDisplayValue,
    getFormattedDateString,
    handleGraphQlException,
    generateDeepCopy,
    copyContents
} from "./data_processing"

const POPUP_ADD_MODE = "add";
const POPUP_EDIT_MODE = "edit";

redirectIfUnauthorized();

Vue.use(VueApollo);

const initialDataSet = {
    popup: {
        addNewFriend: false,
        visible: false,
        mode: "",
        editLending: undefined,
        addNewThing: false,
        errorStore: []
    },
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
    popupLending: {
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
}

let vueApplication = new Vue({
    el: "#dashboard",
    apolloProvider,
    components: {
        Datepicker
    },
    data: generateDeepCopy(initialDataSet),
    methods: {
        resetVueData: function() {
            this.$data = copyContents(initialDataSet, this);
        },
        logOutUser: function() {
            removeJwt();
            clearApolloClientCache();
            redirectIfUnauthorized();
        },
        showAddPopup: function() {
            this.popup.mode = POPUP_ADD_MODE;
            this.popup.visible = true;
        },
        showEditPopup: function(lending) {
            this.popup.mode = POPUP_EDIT_MODE;
            this.popup.editLending = lending;
            this.popup.visible = true;
        },
        hidePopup: function() {
            this.popup.mode = "";
            this.popup.editLending = undefined;
            this.popup.visible = false;
        },
        isNotLastLendingEntry: function(lending) {
            return lending !== this.user.lendings[this.user.lendings.length - 1];
        },
        saveLending: async function() {
            this.popup.errorStore = [];

            let participantId;

            let newFriend = {};
            newFriend["firstName"] = this.popupLending.firstName;
            newFriend["lastName"]  = this.popupLending.lastName;

            if (this.popup.addNewFriend) {
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
                                firstName: this.popupLending.firstName,
                                lastName: this.popupLending.lastName
                            }
                        }).then((data) => {
                            participantId = data.data.createAnonymousUser.id;
                        }).catch((error) => {
                            handleGraphQlException(error, this.popup.errorStore);
                        });
                }
            } else {
                let matchingFriends =
                    this.user
                        .friends
                        .filter((friend) => {
                            return this.popupLending.friendString === getFriendDisplayName(friend)
                        });

                if (matchingFriends.length > 0) {
                    participantId = matchingFriends[0].id;
                } else {
                    this.popup.errorStore.push("Selected friend not existing.");
                    return;
                }
            }

            let thingId;

            if (this.isThingLending(this.popupLending)) {
                if (this.popup.addNewThing) {
                    let matchingThings =
                        this.user
                            .things
                            .filter((thing) => {
                                return this.popupLending.newThingStr === thing.label
                            });
                    
                    if (matchingThings.length > 0) {
                        this.popup.errorStore.push("Thing already existing.");
                        return;
                    } else {
                        await this.$apollo
                            .mutate({
                                mutation: gql`${createThingMutation}`,
                                variables: {
                                    label: this.popupLending.newThingStr
                                }
                            }).then((data) => {
                                thingId = data.data.createThing.id;
                            }).catch((error) => {
                                handleGraphQlException(error, this.popup.errorStore);
                            });
                    }
                } else {
                    let matchingThings =
                        this.user
                            .things
                            .filter((thing) => {
                                return this.popupLending.thingString === thing.label
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
            
            if (this.isThingLending(this.popupLending)) {
                if (this.popup.mode === POPUP_ADD_MODE) {
                    graphQlMutation = createThingLendingMutation;
                } else if (this.popup.mode === POPUP_EDIT_MODE) {
                    graphQlMutation = undefined;
                }

                graphQlVariables = {
                    dueDate: getFormattedDateString(this.popupLending.dueDate),
                    description: this.popupLending.description,
                    participantId: participantId,
                    isBorrowed: this.popupLending.isBorrowed,
                    emoji: this.popupLending.emoji,
                    thingId: thingId
                };
            } else {
                if (this.popup.mode === POPUP_ADD_MODE) {
                    graphQlMutation = createMoneyLendingMutation;
                } else if (this.popup.mode === POPUP_EDIT_MODE) {
                    graphQlMutation = undefined;
                }

                let currencyId =
                    this.currencies
                    .filter(currency => {
                        return getCurrencyDisplayValue(currency) === this.popupLending.currencyString
                    })[0]
                    .id;

                graphQlVariables = {
                    dueDate: getFormattedDateString(this.popupLending.dueDate),
                    description: this.popupLending.description,
                    participantId: participantId,
                    isBorrowed: this.popupLending.isBorrowed,
                    amount: parseInt(this.popupLending.amount),
                    currencyId: currencyId
                };
            }

            let mutationPromise = this.$apollo
                .mutate({
                    mutation: gql`${graphQlMutation}`,
                    variables: graphQlVariables
                }).catch((error) => {
                    handleGraphQlException(error, this.popup.errorStore);
                });;
            
            this.hidePopup();

            await mutationPromise;
            
            this.resetVueData();
            clearApolloClientCache();

            this.fetchUserData();
        },
        getCurrencyString: function(currency) {
            return getCurrencyDisplayValue(currency);
        },
        getFriends: function() {
            return this.user
                        .friends
                        .map((friend) => getFriendDisplayName(friend, friend))
                        .sort();
        },
        getThings: function() {
            return this.user
                        .things
                        .map((thing) => thing.label)
                        .sort();
        },
        isMoneyLending: function(lending) {
            return lending.discriminator === MoneyLendingDiscriminator;
        },
        isThingLending: function(lending) {
            return lending.discriminator === ThingLendingDiscriminator;
        },
        isNewThingLending: function(lending) {
            return this.isThingLending(lending)
                && this.popup.addNewThing === true;
        },
        isOldThingLending: function(lending) {
            return this.isThingLending(lending)
                && this.popup.addNewThing === false;
        },
        getMoneyLendingEmoji: function() {
            return '💵';
        },
        fetchUserData: function() {
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