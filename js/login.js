let logIn_handler = function () {
    let email = $("#login_email").val();
    let password = $("#login_password").val();

    alert("clicked!");
}

window.onload = function () {
    $("#form_login").on("submit", logIn_handler);
}