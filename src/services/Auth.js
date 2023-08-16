import { createProxyFetch, httpBuildQuery, HTTP_JSON_HEADERS } from ".";

const proxy = createProxyFetch('auth', HTTP_JSON_HEADERS);

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

    async register(email, password, fullName) {
        email = this.validateEmail(email);
        password = this.validatePassword(password);

        return proxy('/register', { body: httpBuildQuery({ email, password, fullName }) })
            .then(res => {

                // checks if the response includes the user information
                if (res?.username) {
                    return res;
                }

                if (res?.userInfo?.username) {
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
                if (res?.username) {
                    return res;
                }

                if (res?.userInfo?.username) {
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

    async logout() {
        
    }
};

export default Auth;
