import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import Datepicker from "vuejs-datepicker";
import { apolloProvider } from "./apollo.js"
import { redirectIfUnauthorized, removeJwt } from "./authentication"
import { processUserInfo } from "./data_processing"

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
        },
        user: {
            firstName: ", just loading",
            lastName: "data from server",
            lendings: [],
        },
        lendingTypes: [
            "Money lending",
            "Thing lending"
        ],
        newLending: {
            dueDate: new Date(),
            friend: null,
            discriminator: "Money lending",
        }
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
        saveLending: function() {
            // save to gql server
            // use fast ui response handler

            this.hideAddLendingDialoge();
        },
        getFriends: function() {
            let uniqueFriendArray = new Array();

            this.user
                .lendings
                .map(l => l.other.firstName + " " + l.other.lastName)
                .forEach((o) => {
                    let notInserted = 
                        uniqueFriendArray
                            .filter(
                                f => f == o
                            ).length === 0;

                    if (notInserted) {
                        uniqueFriendArray.push(o);
                    }
                })

            return uniqueFriendArray;
        },
        onPageLoad: function() {
            this.$apollo
                .query({
                    query: gql`query {
                        me {
                            id,
                            firstName,
                            lastName,
                            moneyLendings {
                                id,
                                amount,
                                currency {
                                    symbol
                                },
                                participant {
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

                    let allUnprocessedLendings = 
                        data.data.me.moneyLendings
                            .concat(data.data.me.thingLendings);

                    this.user.lendings = processUserInfo(allUnprocessedLendings);
                }).catch((error) => {
                    this.errorMessage = error.message;
                    console.error(error);
                });
        }
    },
    beforeMount() {
        this.onPageLoad();
    }
});