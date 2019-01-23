const NAVBAR_EXPANDED_WIDTH = "130px";
const NAVBAR_COLLAPSED_WIDTH = "10%";
const COLLAPSE_BTN_SIZE_COLLAPSED = "5.5vw";
const COLLAPSE_BTN_SIZE_EXPANDED = "15px";
const COLLAPSE_BTN_CONTENT_COLLAPSED = "☰";
const COLLAPSE_BTN_CONTENT_EXPANDED = "╳";

function collapseNavbar() {
    let navbar = document.getElementById("navbar");
    let btnCollapse = document.getElementById("btn__collapse");
    let navItems = Array.from(document.getElementsByClassName("nav__item"));

    if (navbar.style.width === NAVBAR_EXPANDED_WIDTH) {
        navbar.style.width = NAVBAR_COLLAPSED_WIDTH;
        btnCollapse.innerText = COLLAPSE_BTN_CONTENT_COLLAPSED;
        btnCollapse.style.fontSize = COLLAPSE_BTN_SIZE_COLLAPSED;

        navItems.forEach(navItem => {
            navItem.style.visibility = "hidden";
        });
    } else {
        navbar.style.width = NAVBAR_EXPANDED_WIDTH;
        btnCollapse.innerText = COLLAPSE_BTN_CONTENT_EXPANDED;
        btnCollapse.style.fontSize = COLLAPSE_BTN_SIZE_EXPANDED;

        navItems.forEach(navItem => {
            navItem.style.visibility = "visible";
        });

    }
}

export function addNavbarCollapseFunctionality() {
    document
        .getElementById("btn__collapse")
        .addEventListener("click", collapseNavbar);
}

export function displayHiddenElements() {
    let elements = Array.from(
            document
                .getElementsByClassName("element__hidden_until_ready"));

    elements.forEach(element => {
        element.style.visibility = "visible";
    })
}