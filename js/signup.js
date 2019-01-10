let signUp_handler = function () {
    let email = $("#signup_email").val();
    let first_name = $("#signup_firstname").val();
    let last_name = $("#signup_lastname").val();
    let password = $("#signup_password").val();

    alert("clicked!");
}

window.onload = function () {
    $("#form_signup").on("submit", signUp_handler);
}