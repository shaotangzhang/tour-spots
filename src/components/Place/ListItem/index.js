import { useState } from "react";
import { getPlace } from "../../../services/Places"

const DEFAULT_IMAGE = process.env.REACT_APP_PLACES_ITEM_DEFAULT_IMAGE || 'https://placehold.co/600x400'

export default function ListItem({ item, imageWidth, extClass, onLoad, onError, children }) {

    const [place, setPlace] = useState();
    const [image, setImage] = useState();

    if (typeof item === 'string') {
        getPlace(item).then(res => {
            setPlace(res);
            setImage(res?.image || res?.preview?.source);
            return res;
        }).then(onLoad).catch(onError);
    } else if (item?.xid) {
        setPlace(item);
        setImage(item?.image || item?.preview?.source);
        Promise.resolve().then(onLoad).catch(onError);
    } else if (typeof onError === 'function') {
        Promise.reject().catch(onError);
    }

    return place ? <div className={`list-group-item d-flex justify-content-between align-items-center ${extClass ? extClass : ''}`} data-testid={place.xid}>
        {
            image
                ? <img src={image} className="img-thumbnail me-3" alt={place.name} style={{ width: imageWidth || 100 }} onError={() => setImage(null)} />
                : ''
        }

        <div className="flex-grow-1">
            <h6><a href={`/search/${place.xid}`} target={place.xid}>{place.name}, {place.address?.country}</a></h6>
            <div>{place.point?.lon}, {place.point?.lat}</div>
        </div>

        {children}
    </div> : '';
}