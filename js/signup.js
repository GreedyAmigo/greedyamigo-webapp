import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";

import {apolloProvider} from "./apollo"

import {signUpMutation} from "./graphql"

import {redirectIfAuthorized, saveJwt} from "./authentication"

import {handleGraphQlException} from "./data_processing"

import {addNavbarCollapseFunctionality, displayHiddenElements} from "./user_interface"

redirectIfAuthorized();

window.onload = function() {
    addNavbarCollapseFunctionality();
    displayHiddenElements();
}

Vue.use(VueApollo);

let vueSignUpForm = new Vue({
    el: "#form__signup",
    apolloProvider,
    data: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        errorStore: []
    },
    methods: {
        signUpUser: function () {
            this.$apollo.mutate({
                mutation: gql`${signUpMutation}`,
                variables: {
                    email: this.email,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    password: this.password
                }
            }).then((data) => {
                this.errorStore = [];

                saveJwt(data.data.signup.token);
                redirectIfAuthorized();
            }).catch((error) => {
                handleGraphQlException(error, this.errorStore);
            });
        }
    }
});