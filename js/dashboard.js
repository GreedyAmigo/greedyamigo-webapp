import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import { apolloProvider } from "./apollo.js"
import { redirectIfUnauthorized, removeJwt } from "./authentication"

redirectIfUnauthorized();

Vue.use(VueApollo);

let vueNavbar = new Vue({
    el: "#navbar",
    methods: {
        logOutUser: function() {
            removeJwt();
            redirectIfUnauthorized();
        }
    }
})

// let vueApplication = new Vue({
//     el: "#dashboard",
//     apolloProvider,
//     data: {
//         // email: "",
//         // password: "",
//         // errorMessage: ""
//     },
//     methods: {
//         logOutUser: function() {
//             removeJwt();
//             redirectIfUnauthorized();
//         }
//         // logInUser: function() {
//         //     this.$apollo.query({
//         //         query:
//         //             gql`query ($email: String!, $password: String!) {
//         //                 login(email: $email, password: $password) {
//         //                     token
//         //                 }
//         //             }`,
//         //         variables: {
//         //             email:    this.email,
//         //             password: this.password
//         //         }
//         //     }).then((data) => {
//         //         this.errorMessage = "";

//         //         const token = data.data.login.token;
//         //         alert(token);

//         //         //todo: save token to local storage
//         //         //todo: redirect user
//         //     }).catch((error) => {
//         //         this.errorMessage = error.message;
//         //         console.error(error);
//         //     });
//         // }
//     }
// });