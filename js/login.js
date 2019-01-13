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
    el: "#form_login",
    apolloProvider,
    data: {
        email: "",
        password: "",
        errorMessage: ""
    },
    methods: {
        logInUser: function() {
            this.$apollo.query({
                query:
                    gql`query ($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            token
                        }
                    }`,
                variables: {
                    email:    this.email,
                    password: this.password
                }
            }).then((data) => {
                this.errorMessage = "";

                const token = data.data.login.token;
                alert(token);

                //todo: save token to local storage
                //todo: redirect user
            }).catch((error) => {
                this.errorMessage = error.message;
                console.error(error);
            });
        }
    }
});