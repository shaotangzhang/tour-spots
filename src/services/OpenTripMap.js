import { createProxyFetch, HTTP_JSON_HEADERS } from ".";

const DEFAULT_COUNTRY = process.env.REACT_APP_DEFAULT_COUNTRY || 'au';
const DEFAULT_LANG = process.env.REACT_APP_DEFAULT_LANG || 'en';
const proxy = createProxyFetch('opentripmap', HTTP_JSON_HEADERS);

export function getPointRange(x, y, r) {
    const ratio = 111111 / r;
    const half = r / 111111 / 2;
    const lon_min = Math.floor((x - half) * ratio) / ratio;
    const lon_max = Math.floor((x + half) * ratio) / ratio;
    const lat_min = Math.floor((y - half) * ratio) / ratio;
    const lat_max = Math.floor((y + half) * ratio) / ratio;

    return [lon_min.toFixed(6), lon_max.toFixed(6), lat_min.toFixed(6), lat_max.toFixed(6)];
}

const OpenTripMap = {
    language: DEFAULT_LANG,

    get lang() {
        return this.language;
    },

    async geoname(name, country) {
        name = String(name || '').trim();
        country = String(country || '').trim() || DEFAULT_COUNTRY;
        return proxy(`/${this.lang}/places/geoname`, { args: { name, country } });
    },

    async bbox({ lon_min, lon_max, lat_min, lat_max, src_geom, src_attr, kinds, name, rate }) {
        const args = arguments[0];
        args.format = 'json';
        args.limit = 500;
        return proxy(`/${this.lang}/places/bbox`, { args });
    },

    async radius({ radius, lon, lat, src_geom, src_attr, kinds, name, rate }) {
        const args = arguments[0];
        args.format = 'json';
        args.limit = 500;
        return proxy(`/${this.lang}/places/radius`, { args });
    },

    async autosuggest({ name, radius, lon, lat, src_geom, src_attr, kinds, rate, props }) {
        const args = arguments[0];
        args.format = 'json';
        args.limit = 500;
        return proxy(`/${this.lang}/places/autosuggest`, { args });
    },

    async xid(xid) {
        return proxy(`/${this.lang}/places/xid/${xid}`);
    },
};

export default OpenTripMap;