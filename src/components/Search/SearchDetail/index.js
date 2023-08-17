import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { getPlace } from "../../../services/Places"
import { searchGallery } from "../../../services/Gallery";
import FavourButton from "./FavourButton";
import Error404 from "../../App/Error404";

function formatTitle(place) {
    let title = place?.wikipedia_extracts?.title;
    if (title) {
        title = title.replace(/^[a-z]+:/, '').trim();
    }
    return title || place?.name || place?.title;
}

function isEnglishText(text) {
    const englishCharCount = [...text].reduce((count, char) => {
      const charCode = char.charCodeAt(0);
      return count + (charCode >= 0 && charCode <= 127 ? 1 : 0);
    }, 0);
  
    return englishCharCount / text.length > 0.5;
  }

function analyzeText(text) {
    const words = text.toLowerCase().split(/\s+/);

    const wordCount = {};
    words.forEach(word => {
        if (word in wordCount) {
            wordCount[word]++;
        } else {
            wordCount[word] = 1;
        }
    });

    const commonWords = ['of', 'the', 'and', 'in', 'to', 'a', 'is', /* ... */];

    const commonWordCount = Object.keys(wordCount)
        .filter(word => commonWords.includes(word))
        .reduce((total, word) => total + wordCount[word], 0);

    const englishRatio = commonWordCount / words.length;
    return englishRatio > 0.5;
}

function translateLink(text, key) {
    if (!analyzeText(text)) {
        return <div className="my-3" key={key}>
            <a href={`https://translate.google.com/?sl=auto&tl=en&op=translate&text=${encodeURIComponent(text)}`} target="_blank">
                <small>Translate this text</small>
            </a>
        </div>;
    }
}

export default function SearchDetail({ xid, onLoad, onError }) {

    const params = useParams();
    const dialog = useRef();

    const [place, setPlace] = useState();

    const [gallery, setGallery] = useState();
    const [galleryPage, setGalleryPage] = useState(1);
    const [galleryTotal, setGalleryTotal] = useState(1);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [galleryRange, setGalleryRange] = useState(0);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState('');

    if (!xid) xid = params.xid;

    useEffect(function () {
        if (typeof xid === 'string') {
            getPlace(xid).then(res => {
                setPlace(res);
                return res;
            }).then(onLoad).catch(onError);
        } else if (typeof onError === 'function') {
            Promise.reject().catch(onError);
        }
    }, [xid, onLoad, onError]);

    useEffect(function () {
        setGalleryPage(0);
        handleGalleryLoadMore();
    }, [place]);

    let galleryTimer;
    const handleGalleryLoadMore = () => {
        if (place && place.name && place.address?.country && (!gallery || (gallery.length < galleryTotal))) {

            if (galleryTimer) clearTimeout(galleryTimer);
            galleryTimer = setTimeout(() => {
                const nextPage = galleryPage + 1;

                setGalleryLoading(true);
                setGalleryRange(galleryRange + 1000);

                searchGallery(`${place.name}, ${place.address.country}`, 24, nextPage, place?.point, galleryRange)
                    .then(res => {
                        const list = gallery || [];
                        res.items.forEach(img => list.find(m => m.id === img.id) || list.push(img));
                        setGallery(list);
                        setGalleryTotal(res.total);
                        return res;
                    })
                    .finally(() => { setGalleryPage(nextPage); setGalleryLoading(false); });

            }, 500);
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

    let description;

    return place?.xid ? <>
        <div className="p-4 mb-3" data-testid={place?.xid}>
            <div className="container">
                <div className="float-end">
                    <FavourButton item={place}></FavourButton>
                </div>

                <section className="d-flex justify-content-start align-items-center" aria-label="Introduction">
                    {
                        place?.preview?.source ? <img src={place?.preview?.source} alt={formatTitle(place)} className="img-thumbnail me-5" style={{ height: 200, maxWidth: 400 }} /> : ''
                    }
                    <section className="flex-grow-1" aria-label="Spot entries">
                        <h3 aria-label="Title">{formatTitle(place)}</h3>
                        <address>
                            {place?.address?.suburb} {place?.address?.state} {place?.address?.postcode} <br />
                            {place?.address?.country}
                        </address>
                        <div>Rate: <em aria-label="status">{place?.rate}</em></div>
                    </section>
                </section>
            </div>
        </div>

        <div className="container">

            <section className="mb-3 pb-3 border-bottom" aria-label="Information">
                <h4 className="mb-3">Information</h4>
                {
                    (description = place?.info || place?.wikipedia_extracts?.text || '')
                        ? [
                            description.replace(/[\r\n]+/, '<br />'),
                            translateLink(description, 1)
                        ]
                        : ''
                }
            </section>

            <section className="mb-3 pb-3 border-bottom" aria-label="Categories">
                <h4 className="mb-3">Categories</h4>
                <p>{

                    (place?.kinds || '').split(',')
                        .filter(kind => kind.trim())
                        .map(kind => <span key={kind} className="btn btn-sm btn-outline-secondary text-dark m-1">{kind.replace(/_/g, ' ')}</span>)

                }</p>
            </section>

            <section className="mb-3 pb-3 border-bottom" aria-label="Gallery">
                <h4 className="mb-3">Gallery</h4>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                    {
                        (gallery || []).filter(item => item.preview || item.url).map(item => <div key={item.id} className="col card border-0 h-100 mb-3" itemScope>
                            <div className="card-img-top text-decoration-none w-100 ratio ratio-1x1" tabIndex={0} style={{
                                backgroundImage: `url(${item.preview || item.url})`,
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

                <div className='p-3' hidden={galleryLoading || (gallery && (gallery.length >= galleryTotal)) || (galleryRange > 25000)}>
                    <button className="btn btn-light text-dark d-block w-75 mx-auto" type="button" onClick={handleGalleryLoadMore}>Explore more (+ {galleryRange / 1000} km)</button>
                </div>

            </section>
        </div>

        <dialog className={`bg-dark d-flex ustify-content-center align-items-center overflow-hidden` + (dialogOpen ? '' : ' d-none')}
            style={{ position: 'fixed', zIndex: 1000 }}
            ref={dialog}>
            <button className="btn btn-close btn-close-white position-absolute m-3 end-0 top-0" type="button" onClick={() => handleDialogClose()}></button>
            <img src={dialogImage} alt="preview" className="img-fluid" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
        </dialog>
    </> : <Error404>Spot is not found.</Error404>;
}