Auth0Wrapper.init();
Auth0Wrapper.redirectIfAuthenticated();

let signUp_handler = function () {
    let email = $("#login_email").val();
    let password = $("#login_password").val();

    Auth0Wrapper.login(email, password);
    GraphQLWrapper.send("");
}

window.onload = function () {
    $("#form_login").on("submit", signUp_handler);
}