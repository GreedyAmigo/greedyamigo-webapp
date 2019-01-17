import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";
import {
    clearApolloClientCache,
    apolloProvider,
    currenciesQuery,
    meQuery,
    createMoneyLendingMutation,
    createThingLendingMutation,
    createThingMutation,
    createFriendMutation
} from "./apollo.js"

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
    getFormattedDateString
} from "./data_processing"

redirectIfUnauthorized();

Vue.use(VueApollo);

const initialDataSet = {
    lendingDialogue: {
        addNewFriend: false,
        addLendingDialogueVisible: false,
        addNewThing: false
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
    currencies: []
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
            this.lendingDialogue.addLendingDialogueVisible = true;
        },
        hideAddLendingDialoge: function() {
            this.lendingDialogue.addLendingDialogueVisible = false;
        },
        isNotLastLendingEntry: function(lending) {
            return lending !== this.user.lendings[this.user.lendings.length - 1];
        },
        saveLending: async function() {
            let participantId;

            let newNameObj = {
                firstName: this.newLending.firstName,
                lastName: this.newLending.lastName
            }

            let matchingFriends =
                this.user
                    .friends
                    .filter((friend) => {
                        return this.newLending.friendString === getFriendDisplayName(friend)
                    });

            if (matchingFriends.length > 0 && this.lendingDialogue.addNewFriend) {
                alert("friend with this name already existing");
                return;
            } else if (matchingFriends.length > 0 && !this.lendingDialogue.addNewFriend) {
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
                        alert(JSON.stringify(error));
                        console.error(error);
                    });
            }

            let thingId;

            let matchingThings =
                this.user
                    .things
                    .filter((thing) => {
                        return this.newLending.thingString === thing.label
                    });

            if (matchingThings.length > 0
                && this.isThingLending(this.newLending)
                && this.lendingDialogue.addNewThing) {

                alert("thing with this label already existing!");
                return;
            } else if (matchingThings.length > 0
                    && this.isThingLending(this.newLending)
                    && !this.lendingDialogue.addNewThing) {

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
                        alert(JSON.stringify(error));
                        console.error(error);
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
                        alert(JSON.stringify(error));
                        console.error(error);
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
                        alert(JSON.stringify(error));
                        console.error(error);
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
                && this.lendingDialogue.addNewThing === true;
        },
        isOldThingLending: function(lending) {
            return this.isThingLending(lending)
                && this.lendingDialogue.addNewThing === false;
        },
        getMoneyLendingEmoji: function() {
            return '💵';
        },
        fetchUserData: function() {
            this.$apollo
                .query({
                    query: gql`${meQuery}`
                }).then((data) => {
                    this.errorMessage = "";
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
                    this.userMessage = error.message;
                    console.error("me: " + error);
                });
            
            this.$apollo
                .query({
                    query: gql`${currenciesQuery}`
                }).then((data) => {
                    this.currencies = data.data.currencies;
                }).catch((error) => {
                    console.error("currencies: " + JSON.stringify(error));
                });
        }
    },
    beforeMount() {
        this.fetchUserData();
    }
});