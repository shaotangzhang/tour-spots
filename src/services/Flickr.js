import { createProxyFetch, HTTP_JSON_HEADERS } from ".";

const DEFAULT_LANG = 'en';
const proxy = createProxyFetch('flickr', HTTP_JSON_HEADERS);

function getRoughlyPoint(x, y, r) {
    if (r <= 0) {
        throw new TypeError('Invalid radius.');
    }

    const ratio = 111111 / r;
    return [(Math.floor(x / ratio) * ratio).toFixed(6), (Math.floor(y / ratio) * ratio).toFixed(6)];
}

const Flickr = {

    language: 'en',

    get lang() {
        return this.language || DEFAULT_LANG;
    },

    photos: {
        search(params, location, radius) {
            return proxy('/services/rest', {
                args: {
                    ...(params || {}),
                    media: 'photos',
                    extras: 'tags,geo',
                    format: 'json',
                    'nojsoncallback': 1
                }
            }).then(res => {
                if (res.photos && (res?.stat === 'ok')) {
                    const center = (location && location.lat && location.lon && radius) ? getRoughlyPoint(location.lon, location.lat, radius) : 0;

                    const items = (Array.isArray(res.photos?.photo) ? res.photos.photo : []).filter(item => {
                        if (center && item.latitude && item.longitude) {
                            if (getRoughlyPoint(item.longitude, item.latitude, radius) !== center) {
                                return false;
                            }
                        }

                        item.preview = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;
                        item.url = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_b.jpg`;

                        return item;
                    });

                    return {
                        items,
                        limit: res.photos.perpage,
                        total: res.photos.total,
                        page: res.photos.page
                    };
                }

                throw new Error('Invalid response');
            });
        }
    },

    async search(text, limit, page, location, radius) {
        page = Math.max(parseInt(page) || 0, 1);
        limit = Math.min(Math.max(parseInt(limit) || 24, 1), 100);
        return this.photos.search({ text, per_page: limit, page }, location, radius);
    },
};

export default Flickr;

