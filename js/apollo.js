import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"
import {getJwt, isAuthenticated} from "./authentication"

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

export async function clearApolloClientCache() {
    await apolloClient.cache.reset();
}