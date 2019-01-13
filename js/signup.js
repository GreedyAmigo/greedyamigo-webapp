import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import { apolloProvider } from "./apollo.js"
import { redirectIfAuthorized, saveJwt } from "./authentication"

redirectIfAuthorized();

Vue.use(VueApollo);

let vueApplication = new Vue({
    el: "#form_signup",
    apolloProvider,
    data: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        errorMessage: ""
    },
    methods: {
        signUpUser: function() {
            this.$apollo.mutate({
                mutation:
                    gql`mutation ($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
                        signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
                            token
                        }
                    }`,
                variables: {
                    email:     this.email,
                    firstName: this.firstName,
                    lastName:  this.lastName,
                    password:  this.password
                }
            }).then((data) => {
                this.errorMessage = "";

                saveJwt(data.data.signup.token);
                redirectIfAuthorized();
            }).catch((error) => {
                this.errorMessage = error.message;
                console.error(error);
            });
        }
    }
});