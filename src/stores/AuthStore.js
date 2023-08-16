import { makeAutoObservable, runInAction } from 'mobx';
import Auth from '../services/Auth';

const STORAGE_KEY = 'AuthStore';
const storeUserInfo = userInfo => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
}

class AuthStore {

    counter = 0
    userInfo

    constructor() {
        makeAutoObservable(this);
        this.userInfo = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (typeof this.userInfo !== 'object') {
            this.userInfo = null;
        }
    }

    get username() {
        return this.userInfo?.username;
    }

    isUserLoggedIn() {
        return !!this.userInfo?.username;
    }

    login(res) {
        runInAction(() => {
            this.counter ++;
            if (res?.username) {
                this.userInfo = res;
            } else if (res?.userInfo?.username) {
                this.userInfo = res.userInfo;
            } else {
                this.userInfo = null;
            }

            storeUserInfo(this.userInfo);
        });
        return res;
    }

    logout() {
        runInAction(() => {
            this.userInfo = null;
            storeUserInfo(this.userInfo);
        });
    }

    async doLogin(email, password) {
        return Auth.login(email, password)
            .then(res => this.login(res));
    }

    async doRegister(email, password, fullName) {
        return Auth.register(email, password, fullName)
            .then(res => {
                runInAction(() => {
                    if (res?.username) {
                        this.userInfo = res;
                    } else if (res?.userInfo?.username) {
                        this.userInfo = res.userInfo;
                    } else {
                        this.userInfo = null;
                    }
                });
                return res;
            });
    }

    async doLogout() {
        return Auth.logout().then(() => this.logout());
    }
}

const instance = new AuthStore();
export default instance;