const __CACHE__ = {};

const STORAGE_KEY = 'Favourist';
const storeUserInfo = (username, list) => {
    localStorage.setItem(STORAGE_KEY + '.' + username, JSON.stringify(list));
}

/**
 * @param {string} username 
 * @returns {Favourists}
 */
export function getFavourists(username) {
    if (username in __CACHE__) {
        return __CACHE__[username];
    }
    return __CACHE__[username] = new Favourists(username);
}

export default class Favourists {
    #username
    #list

    constructor(username) {
        this.#username = username;

        this.#list = JSON.parse(localStorage.getItem('Favourist.' + username));
        if (!Array.isArray(this.#list)) this.#list = [];
    }

    #store() {
        localStorage.setItem('Favourist.' + this.username, JSON.stringify(this.getList()));
    }

    get username() {
        return this.#username;
    }

    getList() {
        return this.#list;
    }

    get(xid) {
        return this.#list.find(item => item.xid === xid);
    }

    has(xid) {
        return !!this.get(xid);
    }

    add(item) {
        if (item?.xid && !this.get(item.xid)) {
            this.#list.push(item);
            storeUserInfo(this.#username, this.#list);
        }
    }

    remove(xid) {
        const index = this.#list.findIndex(item => item.xid === xid);
        if (index >= 0) {
            this.#list.splice(index, 1);
            storeUserInfo(this.#username, this.#list);
        }
    }
}