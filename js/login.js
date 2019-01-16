import Vue from "vue"
import VueApollo from "vue-apollo"
import { apolloProvider, logInUserQuery  } from "./apollo.js"
import { redirectIfAuthorized, saveJwt} from "./authentication"

redirectIfAuthorized();

Vue.use(VueApollo);

let vueLoginForm = new Vue({
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
                query: logInUserQuery,
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