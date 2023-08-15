import { createProxyFetch, getCurrentIpInfo, HTTP_JSON_HEADERS } from ".";
import Auth from "./Auth";
import Storage from "./storage";

const DEFAULT_LANG = 'en';
const DEFAULT_COUNTRY = 'au';

const cache = new WeakMap();
const proxy = createProxyFetch('opentripmap', HTTP_JSON_HEADERS);
const allFavorists = {};

// const favourists = Storage.getObject('opentripmap.favourists') || {};
const validPlaces = Storage.getObject('opentripmap.validPlaces') || [];
const validSearches = Storage.getObject('opentripmap.validSearches') || [];

function initFavors() {
    const username = Auth.getUserInfo()?.username;
    if (username) {
        if (!(username in allFavorists)) {
            allFavorists[username] = Storage.getObject('opentripmap.favourists.' + username);
        }
        return allFavorists[username];
    }
}

// function findInCache(...keys) {
//     const key = keys.join('::');
//     if (key in cache) {
//         return cache[key];
//     }
//     return void 0;
// }

// function saveToCache(data, ...keys) {
//     const key = keys.join('::');
//     return cache[key] = data;
// }

async function cacheOrFetch(callback, ...keys) {
    const key = keys.join('::');
    if (key in cache) {
        return cache[key];
    }

    while (typeof callback === 'function') {
        callback = callback();
    }

    if (callback instanceof Promise) {
        callback = await callback;
    }

    return cache[key] = callback;
}

// function getRoughlyPoint(x, y, r) {
//     if (r <= 0) {
//         throw new TypeError('Invalid radius.');
//     }

//     const ratio = 111111 / r;
//     return [(Math.floor(x / ratio) * ratio).toFixed(6), (Math.floor(y / ratio) * ratio).toFixed(6)];
// }

function getPointRange(x, y, r) {
    const ratio = 111111 / r;
    const half = r / 111111 / 2;
    const lon_min = Math.floor((x - half) * ratio) / ratio;
    const lon_max = Math.floor((x + half) * ratio) / ratio;
    const lat_min = Math.floor((y - half) * ratio) / ratio;
    const lat_max = Math.floor((y + half) * ratio) / ratio;

    return [lon_min.toFixed(6), lon_max.toFixed(6), lat_min.toFixed(6), lat_max.toFixed(6)];
}

const OpenTripMap = {

    language: 'en',

    get lang() {
        return this.language || DEFAULT_LANG;
    },

    /**
     * Returns geographic coordinates for the given placename (region, city, village, etc.).
     * The method returns the place whose name is most similar to the search string.
     * Service based on GeoNames database.
     *
     * Response:
     * ```JSON
     * {
     * "country": "RU",
     * "timezone": "Europe/Moscow",
     * "name": "Moscow",
     * "lon": 37.61556,
     * "lat": 55.75222,
     * "population": 10381222
     * }
     * ```
     */
    async geoname(name, country) {
        name = String(name || '').trim();
        country = String(country || '').trim() || DEFAULT_COUNTRY;

        return cacheOrFetch(() => proxy(`/${this.lang}/places/geoname`, {
            args: { name, country }
        }), 'geoname', country, name.toLowerCase());
    },

    /**
     * Method returns all objects (or number of objects) in the given bounding box optionally filtered by parameters. 
     * Only basic information is include in response: xid, name, kinds, osm, wikidata and geometry of each object. Depending on the chosen format, 
     * the response is either a simple array of objects (with a smaller volume) or an object in GeoJSON format.
     * 
     * Response:
     * ```JSON
     * [
     * {
     * "name": "Oakland City Hall",
     * "osm": "relation/4682064",
     * "xid": "R4682064",
     * "wikidata": "Q932794",
     * "kind": "architecture,other_buildings_and_structures,historic_architecture,interesting_places",
     * "point": {
     * "lon": -122.272705,
     * "lat": 37.80513
     * }
     * }
     * ]
     * ```
     */
    async bbox(lon_min, lon_max, lat_min, lat_max, src_geom, src_attr, kinds, name, rate, format, limit) {
        return cacheOrFetch(() => proxy(`/${this.lang}/places/bbox`, {
            args: { lon_min, lon_max, lat_min, lat_max, src_geom, src_attr, kinds, name, rate, format, limit }
        }), 'bbox', lon_min, lon_max, lat_min, lat_max, src_geom, src_attr, kinds, name, rate, format, limit);
    },

    /**
     * Method returns objects closest to the selected point optionally filtered by parameters. 
     * Only basic information is include in response: xid, name, kinds, osm, wikidata and geometry of each object. 
     * Depending on the chosen format, the response is either a simple array of objects (with a smaller volume) or an object in GeoJSON format.
     * 
     * Response:
     * ```JSON
     * [
     * {
     * "name": "Oakland City Hall",
     * "osm": "relation/4682064",
     * "xid": "R4682064",
     * "wikidata": "Q932794",
     * "kind": "architecture,other_buildings_and_structures,historic_architecture,interesting_places",
     * "point": {
     * "lon": -122.272705,
     * "lat": 37.80513
     * }
     * }
     * ]
     * ```
     */
    async radius({ radius, lon, lat, src_geom, src_attr, kinds, name, rate, format, limit }) {
        return cacheOrFetch(() => proxy(`/${this.lang}/places/radius`, {
            args: { radius, lon, lat, src_geom, src_attr, kinds, name, rate, format, limit }
        }), 'radius', radius, lon, lat, src_geom, src_attr, kinds, name, rate, format, limit);
    },

    /**
     * Method returns suggestions for search term closest to the selected point optionally filtered by parameters. 
     * Only basic information is include in response: xid, name, kinds, osm, wikidata of each object. 
     * Depending on the chosen format, the response is either a simple array of objects (with a smaller volume) or an object in GeoJSON format.
     * 
     * Response:
     * ```JSON
     * [
     * {
     * "xid": "N890538405",
     * "rate": 1,
     * "highlighted_name": "<b>Don</b> Este",
     * "name": "Don Este",
     * "osm": "node/890538405",
     * "dist": 456.55705702,
     * "kinds": "foods,fast_food,tourist_facilities",
     * "point": {
     * "lon": -70.645576,
     * "lat": -33.438782
     * }
     * }
     * ```
     */
    async autosuggest({ name, radius, lon, lat, src_geom, src_attr, kinds, rate, format, props, limit }) {
        return cacheOrFetch(() => proxy(`/${this.lang}/places/autosuggest`, {
            args: { name, radius, lon, lat, src_geom, src_attr, kinds, rate, format, props, limit }
        }), 'autosuggest', name, radius, lon, lat, src_geom, src_attr, kinds, rate, format, props, limit);
    },

    /**
     * Returns detailed information about the object. Objects can contain different amount of information.
     * 
     * Response:
     * ```JSON
     * {
     * "kinds": "architecture,towers,interesting_places,bell_towers",
     * "sources": {
     * "geometry": "osm",
     * "attributes": [
     * "osm",
     * "user",
     * "wikidata"
     * ]
     * },
     * "bbox": {
     * "lat_max": 59.857355,
     * "lat_min": 59.857242,
     * "lon_max": 38.366282,
     * "lon_min": 38.366043
     * },
     * "point": {
     * "lon": 38.366169,
     * "lat": 59.857269
     * },
     * "osm": "way/286786280",
     * "otm": "https://opentripmap.com/ru/card/W286786280",
     * "xid": "W286786280",
     * "name": "Bellfry",
     * "wikipedia": "https://ru.wikipedia.org/wiki/Колокольня_(Кирилло-Белозерский_монастырь)",
     * "image": "https://data.opentripmap.com/images/user/Kirillo-Belozersky Belltower.jpg/original.jpg",
     * "wikidata": "Q4228276",
     * "rate": "3h",
     * "info": {
     * "descr": "Колокольня построена во второй половине XVIII века. Это одно из самых высоких сооружений монастыря. Колокольня состоит из 4 глухих этажей, над которыми возвышается один открытый. В XVIII веке на колокольне было 26 колоколов, самый большойиз них весил около 20 тонн, получивший имя «Мотора». Его звон был слышен в радиусе 20 километров.К сожалению,  в настоящее время на колокольне нет колоколов: их начали снимать при Петре I, когда во время Северной войны четвёртая часть монастырских колоколов (общим весом около 6,5 тонн) пошла на пополнение снаряжения армии. А в годы  советской власти почти всё собрание монастырских звонов было уничтожено.  В 1930 – 1931 годах из монастыря было вывезено свыше 31 тонны колокольной бронзы.\nВ 2006-2007 годахпроведены реставрационные работы. В настоящее время на 3–4 ярусах находится выставка «Колокольный мир», здесь экспонируютсямузейное собрание колоколов и механизм боевых часовна четвертом ярусе колокольни, а ярус звона в летний период открыт для посещения. На колокольне работает Web-камера, через которую можно полюбоваться видом на Соборную площадь в любое время дня и ночи.",
     * "image": "1 (1) (Large)",
     * "img_width": 1620,
     * "src": "belozersk",
     * "src_id": 13,
     * "img_height": 1080
     * }
     * }
     * ```
     */
    async xid(xid) {
        return cacheOrFetch(() => proxy(`/${this.lang}/places/xid/${xid}`), 'xid', xid);
    },

    async findPlace(name, country) {
        name = String(name || '').trim();
        if (name.length < 3) {
            throw new TypeError('The name of search must be over 3 non-empty characters.');
        }

        country = String(country || '').trim().toLowerCase();
        if (country.length !== 2) {
            throw new TypeError('Invalid country code');
        }

        return this.geoname(name, country);
    },

    async searchAround(place, { radius, kinds, limit, page }, sorting, filters) {
        radius = Math.min(Math.max(10000, parseInt(radius) || 0), 1000000);
        page = Math.max(parseInt(page) || 0, 1);
        limit = Math.min(Math.max(parseInt(limit) || 0, 1), 500);

        console.log((page - 1) * limit, page * limit);

        const result = { items: [], total: 0, limit, page, radius };

        if (place && !isNaN(place.lon) && !isNaN(place.lat)) {
            // const items = await this.autosuggest('spot', radius, lon, lat, null, null, null, null, 'json', null, 100);

            // validPlaces.find(place.name) || validPlaces.push(place.name);
            // validSearches.find(search) || validSearches.push(search);

            let items = (await this.bbox(...getPointRange(place.lon, place.lat, radius), null, null, kinds, null, null, 'json', 500));
            if (Array.isArray(items)) {
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
        }
        return result;
    },

    async search({ search, country }) {
        const place = await this.findPlace(search, country);
        const result = await this.searchAround(place, arguments[0]);
        result.items = await Promise.all(result.items.map(item => this.xid(item.xid)));
        return result;
    },

    async searchNearby(radius, limit, page, kinds) {
        const currentLocation = await this.getCurrentLocation();
        const result = await this.searchAround(currentLocation, { radius, limit, page, kinds }, function (a, b) {
            return parseInt(b.rate) - parseInt(a.rate);
        });
        result.items = (await Promise.all(result.items.map(item => this.xid(item.xid)))).filter(item => item.image);
        return result;
    },

    async searchRandom({ lon, lat, radius, limit, page, kinds }) {

        const location = { lon, lat };

        const result = await this.searchAround(location, { radius, limit, page, kinds }, function (a, b) {
            return parseInt(b.rate) - parseInt(a.rate);
        });

        const item = result.items[0];
        return this.xid(item.xid);
    },

    async getCurrentLocation() {
        const ipInfo = await getCurrentIpInfo();
        ipInfo.lon = parseFloat(ipInfo?.lng);
        ipInfo.lat = parseFloat(ipInfo?.lat);
        return ipInfo;
    },

    getValidPlaces() {
        return validPlaces;
    },

    getValidSearches() {
        return validSearches;
    },

    getFavors() {
        const list = initFavors();
        return Object.values(list || {}).filter(item => item.xid);
    },

    inFavor(xid) {
        return xid && (xid in (initFavors() || {}));
    },

    addToFavor(item) {
        const username = Auth.getUserInfo()?.username;
        if (username) {
            if (!allFavorists[username]) {
                allFavorists[username] = {};
            }

            if (item?.xid && !(item.xid in allFavorists[username])) {
                allFavorists[username][item.xid] = item;
                Storage.setObject('opentripmap.favourists.' + username, allFavorists[username]);
            }
        }
    },

    removeFavor(xid) {

        if (xid) {
            const username = Auth.getUserInfo()?.username;
            if (username) {
                if (username in allFavorists) {
                    if (xid in allFavorists[username]) {
                        delete allFavorists[username][xid];
                        Storage.setObject('opentripmap.favourists.' + username, allFavorists[username]);
                    }
                }
            }
        }
    },
};

export default OpenTripMap;

