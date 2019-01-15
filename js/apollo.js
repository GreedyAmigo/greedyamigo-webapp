import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"

const APOLLO_URI = "https://graph.greedy-amigo.com:4000/graphql";

const apolloClient = new ApolloClient({
    uri: APOLLO_URI,
    headers: {
        "Access-Control-Request-Headers": "graph.greedy-amigo.com"
    }
});

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});