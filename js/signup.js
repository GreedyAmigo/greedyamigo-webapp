import ApolloClient from 'apollo-boost'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag';
import { APOLLO_URI } from '../js/settings.js'

const apolloClient = new ApolloClient({
    uri: APOLLO_URI
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});

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

                const token = data.data.signup.token;
                alert(token);

                //todo: save token to localstorage
                //todo: redirect user
            }).catch((error) => {
                this.errorMessage = error.message;
                console.error(error);
            });
        }
    }
});