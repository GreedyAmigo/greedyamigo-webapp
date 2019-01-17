import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";

import {
    clearApolloClientCache,
    apolloProvider
} from "./apollo.js"

import {
    currenciesQuery,
    meQuery,
    createMoneyLendingMutation,
    createThingLendingMutation,
    createThingMutation,
    createFriendMutation
} from "./graphql.js"

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
    handleGraphQlException
} from "./data_processing"

redirectIfUnauthorized();

Vue.use(VueApollo);

const initialDataSet = {
    popup: {
        addNewFriend: false,
        addpopupVisible: false,
        addNewThing: false,
        errorStore: []
    },
    dataFetched: false,
    userMessage: "be patient, we just need to fetch your data",
    user: {
        firstName: ", just loading",
        lastName: "data from server",
        lendings: [],
        friends: [],
        things: []
    },
    lendingTypes: [
        ThingLendingDiscriminator,
        MoneyLendingDiscriminator
    ],
    newLending: {
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
    data: initialDataSet,
    methods: {
        resetVueData: function() {
            this.$data = initialDataSet;
        },
        logOutUser: function() {
            removeJwt();
            redirectIfUnauthorized();
        },
        showAddLendingDialoge: function() {
            this.popup.addpopupVisible = true;
        },
        hideAddLendingDialoge: function() {
            this.popup.addpopupVisible = false;
        },
        isNotLastLendingEntry: function(lending) {
            return lending !== this.user.lendings[this.user.lendings.length - 1];
        },
        saveLending: async function() {
            this.popup.errorStore = [];

            let participantId;

            let newFriend = {};
            newFriend["firstName"] = this.newLending.firstName;
            newFriend["lastName"]  = this.newLending.lastName;

            let matchingFriends =
                this.user
                    .friends
                    .filter((friend) => {
                        return getFriendDisplayName(newFriend) === getFriendDisplayName(friend)
                    });

            if (matchingFriends.length > 0 && this.popup.addNewFriend) {
                this.popup.errorStore.push("Friend already existing.");
                return;
            } else if (matchingFriends.length > 0 && !this.popup.addNewFriend) {
                participantId = matchingFriends[0].id;
            } else {
                await this.$apollo
                    .mutate({
                        mutation: gql`${createFriendMutation}`,
                        variables: {
                            firstName: this.newLending.firstName,
                            lastName: this.newLending.lastName
                        }
                    }).then((data) => {
                        participantId = data.data.createAnonymousUser.id;
                    }).catch((error) => {
                        handleGraphQlException(error, this.popup.errorStore);
                    });
            }

            let thingId;

            let matchingThings =
                this.user
                    .things
                    .filter((thing) => {
                        return this.newLending.newThingStr === thing.label
                    });

            if (matchingThings.length > 0
                && this.isThingLending(this.newLending)
                && this.popup.addNewThing) {

                this.popup.errorStore.push("Thing already existing");
                return;
            } else if (matchingThings.length > 0
                    && this.isThingLending(this.newLending)
                    && !this.popup.addNewThing) {

                thingId = matchingThings[0].id;
            } else if (this.isThingLending(this.newLending)) {
                await this.$apollo
                    .mutate({
                        mutation: gql`${createThingMutation}`,
                        variables: {
                            label: this.newLending.newThingStr
                        }
                    }).then((data) => {
                        thingId = data.data.createThing.id;
                    }).catch((error) => {
                        handleGraphQlException(error, this.popup.errorStore);
                    });
            }

            let mutationPromise;

            if (this.isThingLending(this.newLending)) {
                mutationPromise = this.$apollo
                    .mutate({
                        mutation: gql`${createThingLendingMutation}`,
                        variables: {
                            dueDate: getFormattedDateString(this.newLending.dueDate),
                            description: this.newLending.description,
                            participantId: participantId,
                            isBorrowed: this.newLending.isBorrowed,
                            emoji: this.newLending.emoji,
                            thingId: thingId
                        }
                    }).catch((error) => {
                        handleGraphQlException(error, this.popup.errorStore);
                    });
            } else {
                let currencyId =
                    this.currencies
                        .filter(currency => {
                            return getCurrencyDisplayValue(currency) === this.newLending.currencyString
                        })[0]
                        .id;

                mutationPromise = this.$apollo
                    .mutate({
                        mutation: gql`${createMoneyLendingMutation}`,
                        variables: {
                            dueDate: getFormattedDateString(this.newLending.dueDate),
                            description: this.newLending.description,
                            participantId: participantId,
                            isBorrowed: this.newLending.isBorrowed,
                            amount: parseInt(this.newLending.amount),
                            currencyId: currencyId
                        }
                    }).catch((error) => {
                        handleGraphQlException(error, this.popup.errorStore);
                    });
            }

            this.hideAddLendingDialoge();

            this.resetVueData();

            await mutationPromise;

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