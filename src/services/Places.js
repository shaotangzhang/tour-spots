import OpenTripMap, { getPointRange } from "./OpenTripMap";
import { getCurrentLocation } from ".";

const __CACHE__ = new Map();
const __PLACES__ = {};
const loadPlace = xid => {
    if (xid in __PLACES__) {
        return __PLACES__[xid];
    }
    const item = JSON.parse(localStorage.getItem('Place.items.' + xid)) || null;
    if (item) __PLACES__[xid] = item;
    return item;
};
const storePlace = place => {
    if (place?.xid) {
        __PLACES__[place.xid] = place;
        localStorage.setItem('Place.items.' + place.xid, JSON.stringify(place));
    }
    return place;
}

async function searchAround(place, { radius, kinds, limit, page }, sorting, filters, mapping) {
    if (!place || isNaN(place.lon) || isNaN(place.lat)) {
        throw new TypeError('Invalid place point');
    }

    radius = Math.min(Math.max(10000, parseInt(radius) || 0), 1000000);
    page = Math.max(parseInt(page) || 0, 1);
    limit = Math.min(Math.max(parseInt(limit) || 0, 1), 500);

    const result = { items: [], total: -1, limit, page, radius, place };
    const [lon_min, lon_max, lat_min, lat_max] = getPointRange(place.lon, place.lat, radius);

    const cacheKey = `searchAround::${lon_min}-${lon_max}-${lat_min}-${lat_max}`;

    let items;
    if (__CACHE__.has(cacheKey)) {
        items = __CACHE__.get(cacheKey).value;
        if (!Array.isArray(items)) items = null;
    }

    if (!items) {
        items = {};
        for (const item of await OpenTripMap.bbox({ lon_min, lon_max, lat_min, lat_max, kinds })) {
            items[item.name] = item;
        }
        items = Object.values(items);
        __CACHE__.set(cacheKey, items);
    }

    if (Array.isArray(items)) {
        if (typeof mapping === "function") {
            items = items.map(mapping);
        }

        items = items.filter(item => item.xid);

        if (typeof filters === "function") {
            items = items.filter(filters);
        }

        if (typeof sorting === "function") {
            items.sort(sorting);
        }

        result.total = items.length;
        result.items = items.slice((page - 1) * limit, page * limit);
    }

    return result;
};

export async function getPlace(xid) {
    const item = loadPlace(xid);
    if (item === null) return storePlace(await OpenTripMap.xid(xid));
    return item;
}

export async function findPlace(name, country) {
    name = String(name || '').trim();
    if (name.length < 3) {
        throw new TypeError('The name of search must be over 3 non-empty characters.');
    }

    country = String(country || '').trim().toLowerCase();
    if (country.length !== 2) {
        throw new TypeError('Invalid country code');
    }

    const key = `geoname::${name.toLowerCase()}::${country}`;
    if (__CACHE__.has(key)) {
        return __CACHE__.get(key);
    }

    return OpenTripMap.geoname(name, country).then(result => {
        __CACHE__.set(key, result);
        return result;
    });
}

export async function searchPlaces({ search, country, radius, kinds, limit, page }, sorting, filters) {
    const place = await findPlace(search, country);

    if (!place || isNaN(place.lon) || isNaN(place.lat)) {
        return { items: [], total: -1, limit, page, radius };
    }

    const result = await searchAround(place, { radius, kinds, limit, page }, sorting, filters);

    result.items = (await Promise.all(result.items.map(item => getPlace(item.xid)))).filter(item => item?.xid);
    return result;
};

export async function searchNearby(radius, limit, page, kinds) {
    const currentLocation = await getCurrentLocation();
    currentLocation.lon = parseFloat(currentLocation.lng);
    currentLocation.lat = parseFloat(currentLocation.lat);

    const result = await searchAround(currentLocation, { radius, limit, page, kinds }, function (a, b) {
        return parseInt(b.rate) - parseInt(a.rate);
    });

    result.items = (await Promise.all(result.items.map(item => getPlace(item.xid))))
        .filter(item => item?.xid && (item?.image || item?.preview?.source));

    return result;
}

export async function searchRandom(place, { radius, limit, page, kinds }) {

    const result = await searchAround(place, { radius, limit, page, kinds }, function (a, b) {
        return parseInt(b.rate) - parseInt(a.rate);
    });

    const firstItem = (result?.items || [])[0];

    while (result?.items) {
        const itemIndex = Math.floor(Math.random() * Math.min(10, result.items.length || 0));
        const xid = result.items[itemIndex]?.xid;
        if (xid) {
            const item = await getPlace(xid);
            if (item.preview?.source) return item;
        }
        result.items.splice(itemIndex, 1);
    }

    if (firstItem?.xid) {
        return getPlace(firstItem.xid);
    }
}