var user = null;
export function getCurrentUser() {
    console.log('Getting current user');
    return user;
}
export function setCurrentUser(model) {
    console.log('Setting current user');
    user = model;
}
export function clearCurrentUser() {
    console.log('Clearing current user');
    user = null;
}
