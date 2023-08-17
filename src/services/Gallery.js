import Flickr from "./Flickr";

export async function searchGallery(text, limit, page, location, radius)
{
    return Flickr.search(text, limit, page, location, radius);
}