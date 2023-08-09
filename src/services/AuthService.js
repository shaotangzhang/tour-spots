import AuthState from "../state/auth";
import { ApiProxy, httpBuildQuery, HTTP_JSON_HEADERS } from ".";

const AuthService = {

    async login(email, password) {

        email = String(email || '');
        if (!email.includes('@')) {
            throw new TypeError('Invalid email address');
        }

        password = String(password || '');
        if (password.length < 3) {
            throw new TypeError('Invalid password');
        }

        const body = httpBuildQuery({ email, password });

        return ApiProxy.request('auth', '/login', { method: 'POST', body, ...HTTP_JSON_HEADERS })
            .then(res => {
                if (res?.userInfo && res.loginInfo?.token && res.loginInfo?.expires) {
                    AuthState.login(res.userInfo, res.loginInfo.token, res.loginInfo.expires);
                    if(AuthState.isLogin()) {
                        return res;
                    }
                }
                return false;
            })
    },

    async register(email, password, username) {

        email = String(email || '');
        if (!email.includes('@')) {
            throw new TypeError('Invalid email address');
        }

        password = String(password || '');
        if (password.length < 3) {
            throw new TypeError('Invalid password');
        }

        const body = httpBuildQuery({ email, password, username });

        return ApiProxy.request('auth', '/register', { body, ...HTTP_JSON_HEADERS })
            .then(res => {
                if (res?.userInfo && res.loginInfo?.token && res.loginInfo?.expires) {
                    AuthState.login(res.userInfo, res.loginInfo.token, res.loginInfo.expires);
                    return AuthState.isLogin();
                }
                return false;
            })
    },

    logout() {
        AuthState.logout();
    }

};

export default AuthService;