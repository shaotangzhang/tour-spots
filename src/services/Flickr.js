import { createProxyFetch, getCurrentIpInfo, HTTP_JSON_HEADERS } from ".";
import Storage from "./storage";

const DEFAULT_LANG = 'en';

const cache = new WeakMap();
const proxy = createProxyFetch('flickr', HTTP_JSON_HEADERS);

function findInCache(...keys) {
    const key = keys.join('::');
    if (key in cache) {
        return cache[key];
    }
    return void 0;
}

function saveToCache(data, ...keys) {
    const key = keys.join('::');
    return cache[key] = data;
}

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

function getRoughlyPoint(x, y, r) {
    if (r <= 0) {
        throw new TypeError('Invalid radius.');
    }

    const ratio = 111111 / r;
    return [(Math.floor(x / ratio) * ratio).toFixed(6), (Math.floor(y / ratio) * ratio).toFixed(6)];
}

function getPointRange(x, y, r) {
    const ratio = 111111 / r;
    const half = r / 111111 / 2;
    const lon_min = Math.floor((x - half) * ratio) / ratio;
    const lon_max = Math.floor((x + half) * ratio) / ratio;
    const lat_min = Math.floor((y - half) * ratio) / ratio;
    const lat_max = Math.floor((y + half) * ratio) / ratio;

    return [lon_min.toFixed(6), lon_max.toFixed(6), lat_min.toFixed(6), lat_max.toFixed(6)];
}

const Flickr = {

    language: 'en',

    get lang() {
        return this.language || DEFAULT_LANG;
    },

    /**
     * api_key （must）
     * Your API application key. See here for more details.
     * user_id （optional）
     * The NSID of the user who's photo to search. If this parameter isn't passed then everybody's public photos will be searched. A value of "me" will search against the calling user's photos for authenticated calls.
     * tags （optional）
     * A comma-delimited list of tags. Photos with one or more of the tags listed will be returned. You can exclude results that match a term by prepending it with a - character.
     * tag_mode （optional）
     * Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified.
     * text （optional）
     * A free text search. Photos who's title, description or tags contain the text will be returned. You can exclude results that match a term by prepending it with a - character.
     * min_upload_date （optional）
     * Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime.
     * max_upload_date （optional）
     * Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime.
     * min_taken_date （optional）
     * Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp.
     * max_taken_date （optional）
     * Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp.
     * license （optional）
     * The license id for photos (for possible values see the flickr.photos.licenses.getInfo method). Multiple licenses may be comma-separated.
     * sort （optional）
     * The order in which to sort returned photos. Defaults to date-posted-desc (unless you are doing a radial geo query, in which case the default sorting is by ascending distance from the point specified). The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, and relevance.
     * privacy_filter （optional）
     * Return photos only matching a certain privacy level. This only applies when making an authenticated call to view photos you own. Valid values are:
     * 1 public photos
     * 2 private photos visible to friends
     * 3 private photos visible to family
     * 4 private photos visible to friends & family
     * 5 completely private photos
     * bbox （optional）
     * A comma-delimited list of 4 values defining the Bounding Box of the area that will be searched.
     *
     * The 4 values represent the bottom-left corner of the box and the top-right corner, minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude.
     *
     * Longitude has a range of -180 to 180 , latitude of -90 to 90. Defaults to -180, -90, 180, 90 if not specified.
     *
     * Unlike standard photo queries, geo (or bounding box) queries will only return 250 results per page.
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * accuracy （optional）
     * Recorded accuracy level of the location information. Current range is 1-16 :
     * World level is 1
     * Country is ~3
     * Region is ~6
     * City is ~11
     * Street is ~16
     * Defaults to maximum value if not specified.
     * safe_search （optional）
     * Safe search setting:
     * 1 for safe.
     * 2 for moderate.
     * 3 for restricted.
     * (Please note: Un-authed calls can only see Safe content.)
     * content_type （optional）
     * Content Type setting:
     * 1 for photos only.
     * 2 for screenshots only.
     * 3 for 'other' only.
     * 4 for photos and screenshots.
     * 5 for screenshots and 'other'.
     * 6 for photos and 'other'.
     * 7 for photos, screenshots, and 'other' (all).
     * content_types （optional）
     * Comma-separated list of content types to return. If used in conjunction with video_content_types, this is applied to only photos. If video_content_types is not specified, this filter will apply to all media types
     * 0 for photos.
     * 1 for screenshots.
     * 2 for 'other'.
     * 3 for virtual photos.
     * video_content_types （optional）
     * Comma-separated list of video content types to return. If specified without content_types, ensure that the media argument is not set to 'photos' or no results will be returned
     * 0 for videos.
     * 1 for Screencasts.
     * 2 for Animation/CGI.
     * 3 for Machinima.
     * machine_tags （optional）
     * Aside from passing in a fully formed machine tag, there is a special syntax for searching on specific properties :
     * Find photos using the 'dc' namespace : "machine_tags" => "dc:"
     * Find photos with a title in the 'dc' namespace : "machine_tags" => "dc:title="
     * Find photos titled "mr. camera" in the 'dc' namespace : "machine_tags" => "dc:title=\"mr. camera\"
     * Find photos whose value is "mr. camera" : "machine_tags" => "*:*=\"mr. camera\""
     * Find photos that have a title, in any namespace : "machine_tags" => "*:title="
     * Find photos that have a title, in any namespace, whose value is "mr. camera" : "machine_tags" => "*:title=\"mr. camera\""
     * Find photos, in the 'dc' namespace whose value is "mr. camera" : "machine_tags" => "dc:*=\"mr. camera\""
     * Multiple machine tags may be queried by passing a comma-separated list. The number of machine tags you can pass in a single query depends on the tag mode (AND or OR) that you are querying with. "AND" queries are limited to (16) machine tags. "OR" queries are limited to (8).
     * machine_tag_mode （optional）
     * Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified.
     * group_id （optional）
     * The id of a group who's pool to search. If specified, only matching photos posted to the group's pool will be returned.
     * contacts （optional）
     * Search your contacts. Either 'all' or 'ff' for just friends and family.
     * woe_id （optional）
     * A 32-bit identifier that uniquely represents spatial entities. (not used if bbox argument is present).
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * place_id （optional）
     * A Flickr place id. (not used if bbox argument is present).
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * media （optional）
     * Filter results by media type. Possible values are all (default), photos or videos
     * has_geo （optional）
     * Any photo that has been geotagged, or if the value is "0" any photo that has not been geotagged.
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * geo_context （optional）
     * Geo context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to search for photos that were taken "indoors" or "outdoors".
     *
     * The current list of context IDs is :
     *
     * 0, not defined.
     * 1, indoors.
     * 2, outdoors.
     *
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * lat （optional）
     * A valid latitude, in decimal format, for doing radial geo queries.
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * lon （optional）
     * A valid longitude, in decimal format, for doing radial geo queries.
     *
     * Geo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against "parameterless searches" for queries without a geo component.
     *
     * A tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters — If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future).
     * radius （optional）
     * A valid radius used for geo queries, greater than zero and less than 20 miles (or 32 kilometers), for use with point-based geo queries. The default value is 5 (km).
     * radius_units （optional）
     * The unit of measure when doing radial geo queries. Valid options are "mi" (miles) and "km" (kilometers). The default is "km".
     * is_commons （optional）
     * Limit the scope of the search to only photos that are part of the Flickr Commons project. Default is false.
     * in_gallery （optional）
     * Limit the scope of the search to only photos that are in a gallery? Default is false, search all photos.
     * is_getty （optional）
     * Limit the scope of the search to only photos that are for sale on Getty. Default is false.
     * extras （optional）
     * A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o
     * per_page （optional）
     * Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500.
     * page （optional）
     * The page of results to return. If this argument is omitted, it defaults to 1.
     */
    async photosSearch({
        user_id,
        tags,
        tag_mode,
        text,
        min_upload_date,
        max_upload_date,
        min_taken_date,
        max_taken_date,
        license,
        sort,
        privacy_filter,
        bbox,
        accuracy,
        safe_search,
        content_type,
        content_types,
        video_content_types,
        machine_tags,
        machine_tag_mode,
        group_id,
        contacts,
        woe_id,
        place_id,
        media,
        has_geo,
        geo_context,
        lat,
        lon,
        radius,
        radius_units,
        is_commons,
        in_gallery,
        is_getty,
        extras
    }, location, range) {
        return proxy('/services/rest', {
            args: {
                ...arguments[0],
                media: 'photos',
                extras: 'tags,geo',
                format: 'json',
                'nojsoncallback': 1
            }
        }).then(res => {
            console.log(res);
            if (res.photos && (res?.stat === 'ok')) {

                const center = (location && location.lat && location.lon && range) ? getRoughlyPoint(location.lon, location.lat, range) : 0;

                const items = (Array.isArray(res.photos?.photo) ? res.photos.photo : []).filter(item => {
                    if (center && item.latitude && item.longitude) {
                        if (getRoughlyPoint(item.longitude, item.latitude, range) !== center) {
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
    },

    async search(text, limit, page, location, range) {
        page = Math.max(parseInt(page) || 0, 1);
        limit = Math.min(Math.max(parseInt(limit) || 24, 1), 100);
        return cacheOrFetch(() => this.photosSearch({ text, per_page: limit, page }, location, range), 'flickr.photos.search', text, limit, page);
    },
};

export default Flickr;

