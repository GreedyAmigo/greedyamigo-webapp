import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"
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

export function clearApolloClientCache() {
    apolloClient.cache.reset();
}

export const currenciesQuery = 
    `query{
        currencies{
        id,
        symbol,
        name,
        abbreviation
        }
    }`;

export const meQuery =
    `query {
        me {
            id,
            firstName,
            lastName,
            moneyLendings {
                id,
                amount,
                currency {
                    id,
                    symbol
                },
                participant {
                    id,
                    firstName,
                    lastName
                },
                dueDate,
                description,
                cleared,
                isBorrowed
            },
            thingLendings {
                id,
                emoji,
                participant {
                    id,
                    firstName,
                    lastName
                },
                dueDate,
                description,
                cleared,
                isBorrowed,
                thing {
                    id,
                    label
                }
            },
            things{
                id,
                label
            },
            anonymousUsers{
                id,
                firstName,
                lastName
            }
        }
    }`;

export const createMoneyLendingMutation =
    `mutation(
        $dueDate: DateTime
        $description: String!
        $participantId: ID!
        $isBorrowed: Boolean!
        $amount: Float!
        $currencyId: ID!
    ) {
        createMoneyLending(
            dueDate: $dueDate
            description: $description
            participantId: $participantId
            isBorrowed: $isBorrowed
            amount: $amount
            currencyId: $currencyId
        ) {
            id
        }
    }`;

export const createThingLendingMutation =
    `mutation(
        $dueDate: DateTime
        $description: String!
        $participantId: ID!
        $isBorrowed: Boolean!
        $emoji: String!
        $thingId: ID!
    ) {
        createThingLending(
            dueDate: $dueDate
            description: $description
            participantId: $participantId
            isBorrowed: $isBorrowed
            emoji: $emoji
            thingId: $thingId
        ) {
            id
        }
    }`

export const createThingMutation =
    `mutation($label: String!) {
        createThing(label: $label) {
        id
        }
    }`;

export const createFriendMutation =
    `mutation($firstName: String!, $lastName: String!) {
        createAnonymousUser(firstName: $firstName, lastName: $lastName) {
        id
        }
    }`;