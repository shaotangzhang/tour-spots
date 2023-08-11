import { configure } from 'mobx';

configure({
    enforceActions: 'always',
    computedRequiresReaction: true
});

// export default class Store {

//     #storageKey;
//     #props = {}

//     constructor(props, storageKey, callback) {

//         this.__define__(props || {});

//         if (storageKey) {
//             this.#storageKey = storageKey;

//             const data = this.__fetch__();
//             if (data && (typeof data === 'object')) {
//                 this.__define__(data);
//             }
//         }

//         makeAutoObservable(this);

//         if (typeof callback === 'function') {
//             const setter = (key, value) => {
//                 this.#props[key] = value;
//             };

//             callback(setter);
//         }
//     }

//     __define__(props) {
//         Object.keys(props || {}).forEach(key => {
//             if (!this.hasOwnProperty(key)) {
//                 const SELF = this;

//                 Object.defineProperty(this, key, {
//                     get() {
//                         return SELF.#props[key];
//                     }
//                 });
//             }

//             this.#props[key] = props[key];
//         });
//     }

//     __fetch__() {
//         if (this.#storageKey) {
//             return Storage.getObject(this.#storageKey, void 0);
//         }
//     }

//     __store__() {
//         if (this.#storageKey) {
//             Storage.setObject(this.#storageKey, this.#props);
//         }
//     }

//     async __sync__(promise, successAction, failureAction) {
//         try {
//             while (typeof promise === 'function') {
//                 promise = promise();
//             }

//             let res;
//             if (promise instanceof Promise) {
//                 res = await promise;
//             } else {
//                 res = promise;
//             }

//             if (typeof successAction === 'function') {
//                 runInAction(() => successAction(res));
//             }

//             return res;
//         } catch (e) {
//             if (typeof failureAction === 'function') {
//                 failureAction(new Error(e));
//             } else {
//                 throw new Error(e);
//             }
//         }
//     }
// }

// Object.assign(Store, Storage);