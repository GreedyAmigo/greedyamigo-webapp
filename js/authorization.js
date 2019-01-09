const AUTH0_CLIENT_ID='xL6qnP2LY5o8PxzctN7jMrqhBJcz8k7t';
const AUTH0_DOMAIN='greedy-amigo.eu.auth0.com';
const AUTH0_CONNECTION_NAME="Username-Password-Authentication";

var signup = function(email, password) {
    let payload = {
        "client_id": AUTH0_CLIENT_ID,
        "email": email,
        "password": password,
        "connection": AUTH0_CONNECTION_NAME
     }

    //get jwt from auth0
    $.ajax({
        "async": false,
        "crossDomain": true,
        "url": "https://" + AUTH0_DOMAIN + "/dbconnections/signup",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
             "Access-Control-Allow-Origin": "greedy-amigo.eu.auth0.com"
        },
        "processData": false,
        "data": JSON.stringify(payload)//,
        // "error": function(xhr, _ajaxOptions) {
        //     alert(xhr.responseText);
        // },
        // "success": function(result, status, xhr) {
        //     alert(result);
        //     alert(status);
        // }
    }).done(function(response) {
        alert(response);
    });

    //persist on server

}

signup("manuel.fuchs49@gmail.com", "fuchs");

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