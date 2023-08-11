import { createProxyFetch, httpBuildQuery, HTTP_JSON_HEADERS } from ".";
import Storage from "./storage";

const proxy = createProxyFetch('auth', HTTP_JSON_HEADERS);
const auth = Storage.getObject('auth', {});

const useLabelCallbacks = [];

export function useLabel(callback) {
    if(!useLabelCallbacks.includes(callback)) {
        useLabelCallbacks.push(callback);
    }
}

export function setLabel(label) {
    useLabelCallbacks.forEach(f=>f(label));
}

const Auth = {

    validateEmail(email) {
        email = (email || '').toString();
        if (email.indexOf('@') <= 0) {
            throw new TypeError('Invalid email address');
        }
        return email;
    },

    validatePassword(password) {
        password = (password || '').toString();
        if (password.length < 3) {
            throw new TypeError('Password is empty or too short.')
        }
        return password;
    },

    getUserInfo() {
        return auth?.userInfo;
    },

    isUserLogin() {
        return !!auth?.userInfo?.username;
    },

    async register(email, password, fullName) {
        email = this.validateEmail(email);
        password = this.validatePassword(password);

        return proxy('/register', { body: httpBuildQuery({ email, password, fullName }) })
            .then(res => {

                // checks if the response includes the user information
                if (res?.userInfo?.username) {

                    // stores the auth information to the local storage
                    Storage.setObject('auth', auth);
                    auth.userInfo = { ...res.userInfo };

                    // returns the user information
                    return res.userInfo;
                }

                // checks if there's any error message returned.
                if (res?.error || res?.message) {
                    throw new Error(res?.message || `Error ${res.error}`);
                }

                // unknown error
                throw new Error('Failed to register');
            });
    },

    async login(email, password) {
        email = this.validateEmail(email);
        password = this.validatePassword(password);

        return proxy('/login', { body: httpBuildQuery({ email, password }) })
            .then(res => {

                // checks if the response includes the user information
                if (res?.userInfo?.username) {

                    // stores the auth information to the local storage
                    Storage.setObject('auth', res);
                    auth.userInfo = { ...res.userInfo };

                    // returns the user information
                    return res.userInfo;
                }

                // checks if there's any error message returned.
                if (res?.error || res?.message) {
                    throw new Error(res?.message || `Error ${res.error}`);
                }

                // unknown error
                throw new Error('Failed to login');
            });
    },

    logout() {
        if (auth?.userInfo) {
            delete auth.userInfo;
            Storage.removeObject('auth');
        }
    }
};

export default Auth;