const DASHBOARD_ROUTE = "/pages/dashboard.html";
const INDEX_ROUTE = "/index.html";

export function redirectToDashboard() {
    document.location.replace(DASHBOARD_ROUTE);
}

export function redirectToIndex() {
    document.location.replace(INDEX_ROUTE);
}