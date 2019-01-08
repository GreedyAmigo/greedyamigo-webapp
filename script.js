authorized = function() {

};

$(document).ready(function() {
    if (authorized() === true && windows.location.href.endsWith("index.html")) {
        window.location.replace("/sites/dashboard");
    } else if (authorized() === false) {
        window.location.replace("/index");
    }

    //alert('ready');
});