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
                    symbol,
                    name,
                    abbreviation
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

export const signUpMutation =
    `mutation ($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
        signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
            token
        }
    }`;

export const logInQuery =
    `query ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token,

        }
    }`;