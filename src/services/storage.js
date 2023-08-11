const CACHE = {};
const CACHE_CLEAN_INTERVAL = 10 * 60 * 1000; // 10分钟的毫秒数
let lastCacheCleanupTime = Date.now();

export function isExpired(expires) {
    if (typeof expires === 'number') {
        return expires <= (Date.now() / 1000);
    }

    if (typeof expires === 'string') {
        expires = new Date(expires);
    }

    return expires <= new Date();
}

export function getStoredObject(key, defaultValue) {
    const value = localStorage.getItem(key);
    if ((value === null) || (value === void 0)) {
        return defaultValue;
    }
    try {
        return JSON.parse(value);
    } catch (ex) {
        return defaultValue;
    }
}

export function setStoredObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredObject(key) {
    localStorage.removeItem(key);
}

export function hasStoredObject(key) {
    return localStorage.getItem(key) !== null;
}

export function getCachedObject(key, defaultValue) {
    const obj = (key in CACHE) ? CACHE[key] : getStoredObject('cache:' + key, defaultValue);
    return isExpired(obj.expires) ? defaultValue : (CACHE[key] = obj).data;
}

export function setCachedObject(key, data, expires) {
    if (typeof expires === 'number') {
        const t = new Date();
        t.setTime(t.getTime() + expires * 1000);
        expires = t;
    } else if (typeof expires === 'string') {
        expires = new Date(expires);
    }

    setStoredObject('cache:' + key, CACHE[key] = { data, expires });
}

export function removeCachedObject(key) {
    removeStoredObject('cache:' + key);
    delete CACHE[key];
}

export function hasCachedObject(key) {
    return getCachedObject(key, void 0) !== void 0;
}

const Storage = {
    getObject: getStoredObject,
    setObject: setStoredObject,
    hasObject: hasStoredObject,
    removeObject: removeStoredObject,

    getCache: getCachedObject,
    setCache: setCachedObject,
    isCached: hasCachedObject,
    removeCache: removeCachedObject,
};

export default Storage;

// automatically cleanup cached objects that are expired.
function gcCachedObjects() {
    const keys = localStorage.getItem('[$cached-keys$]').split(',');
    keys.forEach(key => {
        if (!hasCachedObject(key)) {
            removeCachedObject(key);
        }
    });

    for (const key in CACHE) {
        if (!hasCachedObject(key)) {
            removeCachedObject(key);
        }
    }
}

function processIdleTasks(deadline) {
    while (deadline.timeRemaining() > 0
        && (Date.now() - lastCacheCleanupTime >= CACHE_CLEAN_INTERVAL)) {

        gcCachedObjects();

        lastCacheCleanupTime = Date.now();
    }

    if ((Date.now() - lastCacheCleanupTime) >= CACHE_CLEAN_INTERVAL) {
        requestIdleCallback(processIdleTasks);
    }
}

requestIdleCallback(processIdleTasks);