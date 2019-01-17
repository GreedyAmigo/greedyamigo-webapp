import Vue from "vue"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import { apolloProvider } from "./apollo.js"
import { redirectIfAuthorized, saveJwt} from "./authentication"

redirectIfAuthorized();

Vue.use(VueApollo);

let vueLoginForm = new Vue({
    el: "#form__login",
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
                            token,
                
                        }
                    }`,
                variables: {
                    email:    this.email,
                    password: this.password
                }
            }).then((data) => {
                this.errorMessage = "";

                saveJwt(data.data.login.token);
                redirectIfAuthorized();
            }).catch((error) => {
                this.errorMessage = error.message;
                console.error(error);
            });
        }
    }
});