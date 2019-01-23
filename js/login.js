import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import {apolloProvider} from "./apollo"

import {redirectIfAuthorized, saveJwt} from "./authentication"

import {logInQuery} from "./graphql"

import {handleGraphQlException} from "./data_processing"

import {addNavbarCollapseFunctionality, displayHiddenElements} from "./user_interface";

redirectIfAuthorized();

Vue.use(VueApollo);

window.onload = function() {
    addNavbarCollapseFunctionality();
    displayHiddenElements();
}

let vueLoginForm = new Vue({
    el: "#form__login",
    apolloProvider,
    data: {
        email: "",
        password: "",
        errorMessage: "",
        errorStore: []
    },
    methods: {
        logInUser: function () {
            this.$apollo.query({
                query: gql`${logInQuery}`,
                variables: {
                    email: this.email,
                    password: this.password
                }
            }).then((data) => {
                this.errorStore = [];

                saveJwt(data.data.login.token);
                redirectIfAuthorized();
            }).catch((error) => {
                this.errorStore = [];

                handleGraphQlException(error, this.errorStore);
            });
        }
    }
});