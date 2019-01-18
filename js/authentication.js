import {redirectToDashboard, redirectToIndex} from "./redirection"

const LOCAL_STORAGE_JWT_ID = "greedyamigo_jwt";

export function getJwt() {
    return localStorage.getItem(LOCAL_STORAGE_JWT_ID);
}

export function saveJwt(jwt) {
    localStorage.setItem(LOCAL_STORAGE_JWT_ID, jwt);
}

export function removeJwt() {
    localStorage.removeItem(LOCAL_STORAGE_JWT_ID);
}

export function isAuthenticated() {
    return getJwt() !== null;
}

export function redirectIfAuthorized() {
    if (isAuthenticated()) {
        redirectToDashboard();
    }
}

export function redirectIfUnauthorized() {
    if (!isAuthenticated()) {
        redirectToIndex();
    }
}