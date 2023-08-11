import { makeAutoObservable, runInAction } from 'mobx';
import Storage from "../services/storage";
import Auth from '../services/Auth';

const STORAGE_KEY = 'AuthStore';

class AuthStore {

    __userInfo__ = null;

    constructor() {
        makeAutoObservable(this);
        this.__userInfo__ = Storage.getObject(STORAGE_KEY);
    }

    get userInfo() {
        return this.__userInfo__;
    }

    get isUserLoggedIn() {
        return !!this.userInfo?.username;
    }

    login(userInfo) {
        if (!userInfo?.username) {
            userInfo = null;
        }

        this.__userInfo__ = userInfo;
        Storage.setObject(STORAGE_KEY, this.__userInfo__);
    }

    logout() {
        this.__userInfo__ = null;
        Storage.removeObject(STORAGE_KEY);
    }

    async syncLogin(email, password) {
        return this.sync(Auth.login(email, password));
    }

    async syncRegister(email, password, fullName) {
        return this.sync(Auth.register(email, password, fullName));
    }

    async syncLogout() {
        return this.sync(Auth.logout());
    }

    async sync(promise) {
        while (typeof promise === 'function') {
            promise = promise();
        }

        let res = promise;
        if (promise instanceof Promise) {
            res = await promise;
        }

        if (typeof res !== 'object') {
            res = null;
        }

        runInAction(() => {
            if (res?.username) {
                this.login(res);
            } else if (res?.userInfo?.username) {
                this.login(res.userInfo);
            } else {
                this.logout();
            }
        });

        return res;
    }
}

AuthStore.instance = new AuthStore();
export default AuthStore.instance;