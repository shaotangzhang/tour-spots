// import classNames from "classnames";
import "./index.css";

let __UID__ = 0;
const uid = function () {
    return `grid-item-${++__UID__}`;
};

export default function GridItem({ xid, image, title, description, rating, country }) {

    const UID = uid();

    return <div className="card border-0 shadow-sm h-100" aria-labelledby={UID} data-testid="Grid item" itemScope>
        <a href={`/search/${xid}`} target={xid} className="card-img-top text-decoration-none w-100 ratio ratio-1x1" style={{
            backgroundImage: `url(${image || 'https://placehold.co/600x400'})`,
            backgroundRepeat: false,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} aria-label={title}><span className="visually-hidden">photo</span></a>
        <div className="card-body">
            <a href={`/search/${xid}`} target={xid} aria-label={title} className="btn btn-sm d-block btn-outline-secondary border-0 card-title mb-3">{title || 'Unnamed spot'}</a>
            <p className="card-text text-muted fs-sm ellipsis">{description}</p>
        </div>
        <div className="card-footer d-flex justify-content-between border-top-0">
            <span className="btn btn-sm btn-outline-secondary border-0">{country}</span>
            <span className="btn btn-sm btn-outline-secondary border-0">Rate: {rating}</span>
        </div>
    </div>
};