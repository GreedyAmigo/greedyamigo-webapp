import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import { apolloProvider } from "./apollo.js"
import { redirectIfUnauthorized, removeJwt } from "./authentication"
import Datepicker from 'vuejs-datepicker';

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
            addLendingDialogueVisible: false,
            addNewFriend: false,
        },
        lendings: [
            {
                lent: true,
                discriminator: "moneyLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Feb",
                    year: 2019
                },
                other: {
                    firstName: "Manuel",
                    lastName: "Fuchs"
                },
                description: "Washing machine chash",
                cleared: false,
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                amount: 15.4,
                currency: {
                    symbol: "€"
                }
            },
            {
                lent: false,
                discriminator: "thingLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Sep",
                    year: 2019
                },
                other: {
                    firstName: "Thomas",
                    lastName: "Maierixeidiek"
                },
                description: "Needed for a important thing",
                cleared: true,
                emoji: '👕',
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                thing: {
                    id: 5,
                    label: "Washing machine"
                }
            },
            {
                lent: false,
                discriminator: "moneyLending",
                id: 0,
                dueDate: {
                    day: 29,
                    month: "Mar",
                    year: 2017
                },
                other: {
                    firstName: "Simone",
                    lastName: "Ammerixeixirixe"
                },
                description: "Food loan for tasty steak, eaten at OX at the Pluscity in Pasching, where we met with a really good friend of ours and the story goes on and on and on!",
                cleared: true,
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                amount: 76.5,
                currency: {
                    symbol: "€"
                }
            },
            {
                lent: true,
                discriminator: "thingLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Sep",
                    year: 2019
                },
                other: {
                    firstName: "Thomas",
                    lastName: "Maierixeidiek"
                },
                description: "Needed for a important thing",
                cleared: true,
                emoji: '👕',
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                thing: {
                    id: 5,
                    label: "Washing machine"
                }
            },
            {
                lent: true,
                discriminator: "moneyLending",
                id: 0,
                dueDate: {
                    day: 29,
                    month: "Mar",
                    year: 2017
                },
                other: {
                    firstName: "Simone",
                    lastName: "Ammerixeixirixe"
                },
                description: "Food loan for tasty steak, eaten at OX at the Pluscity in Pasching, where we met with a really good friend of ours and the story goes on and on and on!",
                cleared: false,
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                amount: 76.5,
                currency: {
                    symbol: "€"
                }
            },
            {
                lent: true,
                discriminator: "thingLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Sep",
                    year: 2019
                },
                other: {
                    firstName: "Thomas",
                    lastName: "Maierixeidiek"
                },
                description: "Needed for a important thing",
                cleared: true,
                emoji: '👕',
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                thing: {
                    id: 5,
                    label: "Washing machine"
                }
            },
            {
                lent: true,
                discriminator: "moneyLending",
                id: 0,
                dueDate: {
                    day: 29,
                    month: "Mar",
                    year: 2017
                },
                other: {
                    firstName: "Simone",
                    lastName: "Ammerixeixirixe"
                },
                description: "Food loan for tasty steak, eaten at OX at the Pluscity in Pasching, where we met with a really good friend of ours and the story goes on and on and on!",
                cleared: false,
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                amount: 76.5,
                currency: {
                    symbol: "€"
                }
            },
            {
                lent: true,
                discriminator: "thingLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Sep",
                    year: 2019
                },
                other: {
                    firstName: "Thomas",
                    lastName: "Maierixeidiek"
                },
                description: "Needed for a important thing",
                cleared: true,
                emoji: '👕',
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                thing: {
                    id: 5,
                    label: "Washing machine"
                }
            },
            {
                lent: true,
                discriminator: "moneyLending",
                id: 0,
                dueDate: {
                    day: 29,
                    month: "Mar",
                    year: 2017
                },
                other: {
                    firstName: "Simone",
                    lastName: "Ammerixeixirixe"
                },
                description: "Food loan for tasty steak, eaten at OX at the Pluscity in Pasching, where we met with a really good friend of ours and the story goes on and on and on!",
                cleared: false,
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                amount: 76.5,
                currency: {
                    symbol: "€"
                }
            },
            {
                lent: true,
                discriminator: "thingLending",
                id: 0,
                dueDate: {
                    day: 20,
                    month: "Sep",
                    year: 2019
                },
                other: {
                    firstName: "Thomas",
                    lastName: "Maierixeidiek"
                },
                description: "Needed for a important thing",
                cleared: true,
                emoji: '👕',
                updatedAt: null,
                createdAt: {
                    day: 15,
                    month: "Jan",
                    year : 2015
                },
                thing: {
                    id: 5,
                    label: "Washing machine"
                }
            }
        ],
        newLending: {
            dueDate: new Date()
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
        }
        // logInUser: function() {
        //     this.$apollo.query({
        //         query:
        //             gql`query ($email: String!, $password: String!) {
        //                 login(email: $email, password: $password) {
        //                     token
        //                 }
        //             }`,
        //         variables: {
        //             email:    this.email,
        //             password: this.password
        //         }
        //     }).then((data) => {
        //         this.errorMessage = "";

        //         const token = data.data.login.token;
        //         alert(token);

        //         //todo: save token to local storage
        //         //todo: redirect user
        //     }).catch((error) => {
        //         this.errorMessage = error.message;
        //         console.error(error);
        //     });
        // }
    }
});