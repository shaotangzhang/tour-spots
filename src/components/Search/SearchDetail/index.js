import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "./index.css";

import OpenTripMap from "../../../services/OpenTripMap";
import Flickr from "../../../services/Flickr";

export default function SearchDetail({ xid }) {
    const params = useParams();
    const dialog = useRef();

    const [item, setItem] = useState();
    const [inFavor, setInFavor] = useState(null);

    const [gallery, setGallery] = useState();
    const [galleryPage, setGalleryPage] = useState(1);
    const [galleryTotal, setGalleryTotal] = useState(1);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [galleryRange, setGalleryRange] = useState(0);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState('');

    if (!xid) xid = params.xid;

    useEffect(function () {
        if (xid) {
            OpenTripMap.xid(xid)
                .then(item => {
                    setItem(item);
                    setGalleryRange(1000);
                    setInFavor(OpenTripMap.inFavor(xid));

                    if (item.name && item.address?.country) {
                        setGalleryLoading(true);
                        Flickr.search(`${item.name}, ${item.address.country}`, 24, 1, item?.point, galleryRange)
                            .then(res => {
                                setGallery(res.items);
                                setGalleryTotal(res.total);
                            })
                            .finally(() => setGalleryLoading(false));
                    }
                    return item;
                });
        }
    }, [xid]);

    const handleGalleryLoadMore = () => {
        if (item && item.name && item.address?.country && (!gallery || (gallery.length < galleryTotal))) {
            const nextPage = galleryPage + 1;

            setGalleryLoading(true);
            setGalleryRange(galleryRange + 1000);
            Flickr.search(`${item.name}, ${item.address.country}`, 24, nextPage, item?.point, galleryRange)
                .then(res => {
                    const list = gallery || [];
                    res.items.forEach(img => list.find(m => m.id === img.id) || list.push(img));
                    setGallery(list);
                    setGalleryTotal(res.total);
                    return res;
                })
                .finally(() => { setGalleryPage(nextPage); setGalleryLoading(false); });
        }
    };

    const handlePopup = (image) => {
        setDialogImage(image);
        setDialogOpen(true);
        dialog?.current?.showModal();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        dialog?.current.close();
    }

    const handleAddToFavor = (toggle) => {
        if (item) {
            if (toggle) {
                OpenTripMap.addToFavor(item);
            } else {
                OpenTripMap.removeFavor(item);
            }

            setInFavor(toggle);
        }
    }

    return <>
        <div className="bg-light p-4 mb-3">
            <div className="container">
                <div className="float-end" hidden={inFavor===null}>
                {
                    inFavor
                        ? <button className="btn btn-outline-danger" onClick={() => handleAddToFavor(false)}>Remove favor</button>
                        : <button className="btn btn-outline-secondary" onClick={() => handleAddToFavor(true)}>Add to favor</button>
                }
                </div>

                <div className="d-flex justify-content-start align-items-center">
                    {
                        item?.preview?.source ? <img src={item?.preview?.source} className="img-thumbnail me-5" style={{ height: 200 }} /> : ''
                    }                    
                    <div className="flex-grow-1">
                        <h3>{(item?.wikipedia_extracts?.title || '').replace(/[a-z]+\:/, '') || item?.name}</h3>
                        <address>
                            {item?.address?.suburb} {item?.address?.state} {item?.address?.postcode} <br />
                            {item?.address?.country}
                        </address>
                        <p>Rate: {item?.rate}</p>
                        <p>{item?.point?.lon}, {item?.point?.lat}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="container">

            <section className="mb-3 pb-3 border-bottom">
                <h4 className="mb-3">Information</h4>

                {(item?.info || item?.wikipedia_extracts?.text || '').replace(/[\r\n]+/, '<br />')}
            </section>

            <section className="mb-3 pb-3 border-bottom">
                <h4 className="mb-3">Categories</h4>
                <p>{

                    (item?.kinds || '').split(',').filter(kind => kind.trim()).map(kind => <span key={kind} className="btn btn-sm btn-outline-secondary text-dark m-1">{kind.replace(/_/g, ' ')}</span>)

                }</p>
            </section>

            <section className="mb-3 pb-3 border-bottom">
                <h4 className="mb-3">Gallery</h4>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                    {
                        (gallery || []).map(item => <div key={item.id} className="col card border-0 h-100 mb-3" itemScope>
                            <div className="card-img-top text-decoration-none w-100 ratio ratio-1x1" tabIndex={0} style={{
                                backgroundImage: `url(${item.preview || item.url || 'https://placehold.co/600x400'})`,
                                backgroundRepeat: false,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} title={item.title} onClick={() => handlePopup(item.url)}>
                            </div>
                            <div className="bg-dark opacity-7 text-white px-2 text-nowrap overflow-hidden" style={{ lineHeight: '2rem', fontSize: 'small' }}>{item.title}</div>
                        </div>)
                    }
                </div>

                <div className='bg-light p-3' hidden={!galleryLoading}>
                    <span className="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
                    <span role="status">Searching...</span>
                </div>

                <div className='p-3' hidden={galleryLoading || (gallery && (gallery.length >= galleryTotal))}>
                    <button className="btn btn-light text-dark d-block w-75 mx-auto" type="button" onClick={handleGalleryLoadMore}>Explore more (+ {galleryRange / 1000} km)</button>
                </div>

            </section>
        </div>

        <dialog className={`bg-dark d-flex ustify-content-center align-items-center overflow-hidden` + (dialogOpen ? '' : ' d-none')}
            style={{ position: 'fixed', zIndex: 1000 }}
            ref={dialog}>
            <button className="btn btn-close btn-close-white position-absolute m-3 end-0 top-0" type="button" onClick={() => handleDialogClose()}></button>
            <img src={dialogImage} className="img-fluid" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
        </dialog>
    </>
};