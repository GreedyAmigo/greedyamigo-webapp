Auth0Wrapper.init();
Auth0Wrapper.redirectIfAuthenticated();

let signUp_handler = function () {
    let email = $("#signup_email").val();
    let first_name = $("#signup_firstname").val();
    let last_name = $("#signup_lastname").val();
    let password = $("#signup_password").val();

    Auth0Wrapper.signup(email, password);
    GraphQLWrapper.send("");
}

window.onload = function () {
    $("#btn_signup").click(signUp_handler);
}