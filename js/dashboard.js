import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";
import {
    clearApolloClientCache,
    apolloProvider
} from "./apollo.js"

import {
    redirectIfUnauthorized,
    removeJwt
} from "./authentication"

import {
    processUserInfo,
    MoneyLendingDiscriminator,
    ThingLendingDiscriminator,
    processNewLending
} from "./data_processing"

redirectIfUnauthorized();

Vue.use(VueApollo);

let vueApplication = new Vue({
    el: "#dashboard",
    apolloProvider,
    components: {
        Datepicker
    },
    data: {
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
        },
        lendingTypes: [
            ThingLendingDiscriminator,
            MoneyLendingDiscriminator
        ],
        newLending: {
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
    },
    methods: {
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
        saveLending: function() {
            let processedLending = processNewLending(this.newLending, this.lendingDialogue);

            this.hideAddLendingDialoge();

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
                    query:
                        gql`query {
                            me {
                                id,
                                firstName,
                                lastName,
                                moneyLendings {
                                    id,
                                    amount,
                                    currency {
                                        id,
                                        symbol
                                    },
                                    participant {
                                        id,
                                        firstName,
                                        lastName
                                    },
                                    dueDate,
                                    description,
                                    cleared,
                                    isBorrowed
                                },
                                thingLendings {
                                    id,
                                    emoji,
                                    participant {
                                        id,
                                        firstName,
                                        lastName
                                    },
                                    dueDate,
                                    description,
                                    cleared,
                                    isBorrowed,
                                    thing {
                                        id,
                                        label
                                    }
                                }
                            }
                        }`
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
                    console.error(error);
                });
            
            this.$apollo
                .query({
                    query:
                        gql`query{
                            currencies{
                              id,
                              symbol,
                              name,
                              abbreviation
                            }
                          }`
                }).then((data) => {
                    this.currencies = data.data.currencies;
                }).catch((error) => {
                    console.error(JSON.stringify(error));
                });
        }
    },
    beforeMount() {
        this.fetchUserData();
    }
});