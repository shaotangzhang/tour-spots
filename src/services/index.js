import CryptoJS from 'crypto-js';

const API_PROXY_HOST = process.env.REACT_APP_API_PROXY_HOST;
const API_PROXY_USER = process.env.REACT_APP_API_PROXY_USER;
const API_PROXY_PASS = process.env.REACT_APP_API_PROXY_PASS;
const AUTH = { token: '', expires: 0 };

export function httpBuildQuery(params) {
    const search = new URLSearchParams();
    Object.keys(params || {}).forEach(key => search.append(key, params[key]));
    return search.toString();
}

export const HTTP_JSON_HEADERS = {
    headers: {
        Accept: 'application/json'
    }
};

export const HTTP_JSON_RESPONSE = response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText || `Http Error ${response.status}`);
    }
}

export const ApiProxy = {

    encrypt(text, secretKey) {
        return CryptoJS.AES.encrypt(text, secretKey).toString();
    },

    decrypt(ciphertext, secretKey) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    },

    async ip() {

        const options = HTTP_JSON_RESPONSE;
        options.headers.user = API_PROXY_USER;
        options.headers.pass = API_PROXY_PASS;

        const secretKey = this.encrypt(API_PROXY_USER, API_PROXY_PASS);

        return fetch(API_PROXY_HOST + '/ip', options)
            .then(HTTP_JSON_RESPONSE).then(res => {
                if (res?.ip && res?.eTag) {
                    try {
                        const data = JSON.parse(this.decrypt(res.eTag, secretKey));
                        if ((data?.ip === res.ip) && (data.user === API_PROXY_USER) && data.token) {
                            AUTH.expires = data.expires;
                        }
                    } catch (ex) { }
                }
                return res;
            });
    },

    async refreshToken() {
        if (!AUTH || !AUTH.token) {
            return Promise.reject(false);
        }

        return this.request('auth', '/refreshToken', HTTP_JSON_HEADERS)
            .then(HTTP_JSON_RESPONSE)
            .then(res => {
                if (res?.token && res.expires) {
                    AUTH.expires = res.expires;
                    return AUTH.token = res.token;;
                }
            });
    },

    request(provider, path, options) {
        path = String(path || '');
        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        if (typeof options !== 'object') {
            options = {};
        }

        const url = `${API_PROXY_HOST}/${provider}${path}`;

        if (!AUTH.token) {
            throw new Error('Unable to connect to the api server.');
        }

        options = {
            ...(options || {}),
            headers: {
                ...(options.headers || {}),
                api_key: AUTH.token
            }
        };

        return fetch(url, options);
    }
};


const Service = {
    ApiProxy
}

export default Service;