import { atom, selector } from 'recoil';

let auth = JSON.parse(localStorage.getItem('auth'));
if (typeof auth !== 'object') auth = null;

export const userInfo = atom({
    key: 'userInfo',
    default: auth?.userInfo,
});

export const loginInfo = atom({
    key: 'loginInfo',
    default: auth?.loginInfo
});

export const isUserLogin = selector({
    key: 'isUserLogin',
    get: ({ get }) => {
        const user = get(userInfo);
        const login = get(loginInfo);
        return user?.username && (login?.token) && (login?.expires > (new Date()));
    },
});

export function login(userInfo, token, expires) {

    if (typeof expires === 'number') {
        const t = new Date();
        t.setTime(expires * 1000);
        expires = t;
    } else if (typeof expires === 'string') {
        expires = new Date(expires);
    } else if (!(expires instanceof Date())) {
        expires = null;
    }

    if (expires >= new Date()) {
        const AUTH = {
            userInfo,
            loginInfo: {
                token,
                expires
            }
        };

        localStorage.setItem('auth', JSON.stringify(AUTH));
        auth = AUTH;
    } else {
        logout();
    }
}

export function logout() {
    auth = null;
    localStorage.removeItem('auth');
}

const AuthState = {
    login,
    logout,
    isLogin() {
        return auth?.userInfo?.username && auth?.loginInfo?.token && (auth?.loginInfo?.expires > (new Date()));
    }
};

export default AuthState;