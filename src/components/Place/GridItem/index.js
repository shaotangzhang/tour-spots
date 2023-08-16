import { useEffect, useState } from "react";
import { getPlace } from "../../../services/Places"

const DEFAULT_IMAGE = process.env.REACT_APP_PLACES_ITEM_DEFAULT_IMAGE || 'https://placehold.co/600x400';

function formatTitle(place) {
    let title = place?.wikipedia_extracts?.title;
    if (title) {
        title = title.replace(/^[a-z]+:/, '').trim();
    }
    return title || place?.name || place?.title;
}

export default function GridItem({ item, autoHeight, shadow, footer, extClass, onLoad, onError }) {

    const [place, setPlace] = useState();

    useEffect(function () {
        if (typeof item === 'string') {
            getPlace(item).then(res => setPlace(res)).then(onLoad).catch(onError);
        } else if (item?.xid) {
            setPlace(item);
            Promise.resolve().then(onLoad).catch(onError);
        } else if (typeof onError === 'function') {
            Promise.reject().catch(onError);
        }
    }, [item, onLoad, onError]);

    return place ? <div className={`card ${autoHeight ? ' h-100' : ''}${shadow ? ' shdadow-sm' : ''} ${extClass ? extClass : ''}`} data-testid={place.xid}>

        <a href={`/search/${place.xid}`} target={place.xid} className="card-img-top text-decoration-none w-100 ratio ratio-1x1" style={{
            backgroundImage: `url(${place.preview?.source || DEFAULT_IMAGE})`,
            backgroundRepeat: false,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} aria-label={formatTitle(place)}><span className="visually-hidden">photo of {formatTitle(place)}</span></a>

        <div className="card-body">
            <a href={`/search/${place.xid}`} target={place.xid} className="btn btn-sm d-block btn-outline-secondary border-0 card-title mb-3"
                aria-label={formatTitle(place)}>{formatTitle(place) || 'Unnamed spot'}</a>
            <p className="card-text text-muted fs-sm ellipsis-3">{place.description || place.wikipedia_extracts?.text}</p>
        </div>

        {
            footer ? <div className="card-footer d-flex justify-content-between border-top-0">
                <span className="btn btn-sm btn-outline-secondary border-0 disabled">{place.address?.country}</span>
                <span className="btn btn-sm btn-outline-secondary border-0 disabled">Rate: {place.rate}</span>
            </div> : ''
        }


    </div> : '';
}