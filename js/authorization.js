let Auth0Wrapper = {
    jwt: undefined,
    expiresAt: undefined,
    webAuth: undefined,

    init : function () {
        webAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            responseType: "token"
        });

        let url_parts = window.location.href.split("#");

        if (url_parts.length === 2) {
            let parameters = url_parts[1].split("&");
            
            if (parameters.length === 5) {
                let access_token_param = parameters[0].split("=");

                if (access_token_param[0] === "access_token"
                    && access_token_param.length === 2) {

                    jwt = access_token_param[1];
                }
            }
        } else {
            Auth0Wrapper.recoverPreviousState();
        }
    },

    isAuthenticated: function () {
        //todo: validate with hash value from local storage
        return false;
    },

    persistCurrentState: function () {
        localStorage.setItem(
            LOCAL_STORAGE_ACCESS_TOKEN_ID,
            JSON.stringify(Auth0Wrapper.jwt));
        //todo: save hash values
        localStorage.setItem(
            LOCAL_STORAGE_EXPIRES_AT_ID,
            JSON.stringify(Auth0Wrapper.expiresAt));
    },

    recoverPreviousState: function () {
        Auth0Wrapper.jwt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_ID));
        //todo: get hash value
        Auth0Wrapper.expiresAt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EXPIRES_AT_ID));
    },

    removeCurrentState: function() {
        Auth0Wrapper.jwt = undefined;
        // todo: set hash to undefined
        Auth0Wrapper.expiresAt = undefined;

        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_ID);
        localStorage.removeItem('graphql_auth0_id_token')
        localStorage.removeItem(LOCAL_STORAGE_EXPIRES_AT_ID);
    },
    
    signup: async function (email, password) {
        Auth0Wrapper.jwt = await webAuth.signup({
            connection: AUTH0_CONNECTION_NAME,
            email: email,
            password: password/*,
            redirectUri: AUTH_MAIN_PAGE*/
        }, function(err) {
            if (err) {
                alert(err.description);
            } else {
                alert("persisting changes");
                Auth0Wrapper.persistCurrentState();
            }
        });
    },

    login: async function(email, password) {
        Auth0Wrapper.jwt = await webAuth.login({
            realm: AUTH0_CONNECTION_NAME,
            email: email,
            password: password,
            redirectUri: AUTH_MAIN_PAGE
        });
    },

    logout: function() {
        Auth0Wrapper.removeCurrentState();

        webAuth.logout({
            returnTo: UNAUTH_MAIN_PAGE
        });
    },

    redirectIfUnauthenticated: function() {
        if (!Auth0Wrapper.isAuthenticated()) {
            window.location.replace(UNAUTH_MAIN_PAGE);
        }
    },

    redirectIfAuthenticated: function() {
        if (Auth0Wrapper.isAuthenticated) {
            window.location.replace(AUTH_MAIN_PAGE);
        }
    }
}




// export default class Auth {
//     authenticated = this.isAuthenticated()
//     authNotifier = new EventEmitter()

//     constructor () {
//         this.login = this.login.bind(this)
//         this.setSession = this.setSession.bind(this)
//         this.logout = this.logout.bind(this)
//         this.isAuthenticated = this.isAuthenticated.bind(this)
//     }

//     auth0 = new auth0.WebAuth({
//         domain: '{AUTH0_DOMAIN}',
//         clientID: '{AUTH0_CLIENT_ID}',
//         redirectUri: '{AUTH0_CALLBACK_URL}',
//         audience: '{AUTH0_AUDIENCE}',
//         responseType: 'token id_token',
//         scope: 'openid'
//     })

//     login () {
//         this.auth0.authorize()
//     }

//     handleAuthentication () {
//         this.auth0.parseHash((err, authResult) => {
//             if (authResult && authResult.accessToken && authResult.idToken) {
//             this.setSession(authResult)
//             router.replace('/')
//             } else if (err) {
//             router.replace('/')
//             }
//     })
//     }

//     setSession (authResult) {
//         // Set the time that the access token will expire at
//         const expiresAt = JSON.stringify(
//             authResult.expiresIn * 1000 + new Date().getTime()
//     )

//     localStorage.setItem('graphql_auth0_access_token', authResult.accessToken)
//     localStorage.setItem('graphql_auth0_id_token', authResult.idToken)
//     localStorage.setItem('graphql_auth0_expires_at', expiresAt)

//     this.authNotifier.emit('authChange', { authenticated: true })
//     }

//     logout () {
//         // Clear access token and ID token from local storage
//         localStorage.removeItem('graphql_auth0_access_token')
//         localStorage.removeItem('graphql_auth0_id_token')
//         localStorage.removeItem('graphql_auth0_expires_at')

//         this.authNotifier.emit('authChange', false)

//         // navigate to the home route
//         router.replace('/')
//     }

//     isAuthenticated () {
//         // Check whether the current time is past the
//         // access token's expiry time
//         const expiresAt = JSON.parse(
//             localStorage.getItem('graphql_auth0_expires_at')
//         )

//         return new Date().getTime() < expiresAt
//     }
// }