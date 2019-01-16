import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"
import gql from "graphql-tag";
import { isAuthenticated, getJwt } from "./authentication"

const APOLLO_URI = "https://graph.greedy-amigo.com:4000/graphql";

let apolloHeaders = {
    "Access-Control-Request-Headers": "graph.greedy-amigo.com"
};

if (isAuthenticated()) {
    apolloHeaders["Authorization"] = "Bearer " + getJwt();
}

const apolloClient = new ApolloClient({
    uri: APOLLO_URI,
    headers: apolloHeaders
});

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});

/* -------------------------------------------- */
/* GraphyQl Queries                             */
/* -------------------------------------------- */
export const logInUserQuery = 
    gql`query ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }`;

export const getUserDataQuery =
    gql`query {
        me {
            id,
            firstName,
            lastName,
            moneyLendings {
                amount,
                currency {
                    symbol
                },
                participant {
                    firstName,
                    lastName
                },
                dueDate,
                description,
                cleared,
                isBorrowed
            },
            thingLendings {
                emoji,
                participant {
                    firstName,
                    lastName
                },
                dueDate,
                description,
                cleared,
                isBorrowed
            }
        }
    }`;

/* -------------------------------------------- */
/* GraphyQl Mutations                           */
/* -------------------------------------------- */
export const signUpUserMutation =
    gql`mutation ($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
        signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
            token
        }
    }`