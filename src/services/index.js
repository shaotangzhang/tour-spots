// import CryptoJS from "crypto-js";

import { getStoredObject, setStoredObject, isExpired } from "./storage";

// const API_PROXY_HOST = 'http://tour-spots.top';
// const API_PROXY_USER = 'tour-spots.github'
const API_PROXY_HOST = process.env.REACT_APP_API_PROXY_HOST;
const API_PROXY_USER = process.env.REACT_APP_API_PROXY_USER;
const API_PROXY_PASS = process.env.REACT_APP_API_PROXY_PASS;

const IP_INFO_STORAGE_KEY = 'current-ip-info';
const INFO = getStoredObject(IP_INFO_STORAGE_KEY, {});

/**
 * Returns the current token for api proxy callings
 */
async function getApiProxyToken() {
    if (!INFO.token || isExpired(INFO.expires)) {
        await ip();
    }

    if (INFO.token && !isExpired(INFO.expires)) {
        return INFO.token;
    }
}

/**
 * Fetches the current ip address of the client end
 */
async function ip() {
    return fetch(API_PROXY_HOST + '/ip', {
        headers: {
            Accept: 'application/json',
            'app-id': API_PROXY_USER,
            'app-secret': API_PROXY_PASS
        }
    }).then(HTTP_JSON_RESPONSE).then(info => {
        if (info?.ip) {
            if (info.loc) {
                const [lat, lng] = String(info.loc).split(',');
                INFO.lat = info.lat = lat;
                INFO.lng = info.lng = lng;
            }
            INFO.token = info.token;
            INFO.expires = info.expires;

            setStoredObject(IP_INFO_STORAGE_KEY, info);
        }
    });
}

/**
 * Returns the (cached) current ip address of the client end
 */
export async function getCurrentIpInfo() {
    return INFO.ip ? INFO : await ip();
}

/**
 * The common process for checking response with JSON formatted data from fetch api.
 */
export const HTTP_JSON_RESPONSE = response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText || `Http Error ${response.status}`);
    }
}

/**
 * The headers setting for JSON requests.
 */
export const HTTP_JSON_HEADERS = {
    headers: {
        Accept: 'application/json'
    }
};

/**
 * Defines a fetch function for calling the api via the proxy
 * @param {string} provider 
 * @param {object} context 
 * @returns {Function}
 */
export function createProxyFetch(provider, context) {

    const baseURL = API_PROXY_HOST + '/' + provider;

    return async function (url, options) {

        const token = await getApiProxyToken();

        options = {
            ...(context || {}),
            ...(options || {}),
            headers: {
                ...(context?.headers || {}),
                ...(options?.headers || {}),
                'app-id': API_PROXY_USER,
                'app-token': token,
            }
        }

        url = httpBuildUrl(url, options?.args);

        if (options.body && !options.method) {
            options.method = 'POST';
        }

        return fetch(baseURL + url, options).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText || `HTTP ${response.status} error.`);
            }

            if (options.headers.Accept === 'application/json') {
                return response.json();
            }

            return response;
        });
    }
}

/**
 * A helper function to append the arguments to a URL
 * @param {string} url 
 * @param {string|object} args 
 * @returns {string}
 */
export function httpBuildUrl(url, args) {
    if (typeof args === 'object') {
        args = httpBuildQuery(args).toString();
    }

    if (typeof args === 'string') {
        url += ((url.indexOf('?') >= 0) ? '&' : '?') + args;
    }

    return url;
}

/**
 * A helper function to combine an object into the search parameters to a URL
 * @param {object} params 
 * @returns {URLSearchParams}
 */
export function httpBuildQuery(params) {
    const search = new URLSearchParams();
    Object.keys(params || {}).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            search.append(key, params[key])
        }else{
            search.delete(key);
        }
    });
    return search;
}