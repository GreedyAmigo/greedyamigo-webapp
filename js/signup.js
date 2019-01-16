import Vue from "vue"
import VueApollo from "vue-apollo"
import { apolloProvider, signUpUserMutation } from "./apollo.js"
import { redirectIfAuthorized, saveJwt } from "./authentication"

redirectIfAuthorized();

Vue.use(VueApollo);

let vueSignUpForm = new Vue({
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
                mutation: signUpUserMutation,
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