import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import GridItem from "../Place/GridItem";

import "./index.css";

import { searchPlaces } from "../../services/Places";

export default function Search() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [kinds, setKinds] = useState(params.get('kinds'));
    const [search, setSearch] = useState(params.get('search') || '');
    const [country, setCountry] = useState(params.get('country') || 'au');

    const [searchResult, setSearchResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState();
    const [hasMore, setHasMore] = useState(true);

    useEffect(function () {
        const params = new URLSearchParams(location.search);
        setSearch(params.get('search') || '');
        setCountry(params.get('country') || 'au');
        setKinds(params.get('kinds'));
    }, [location.search]);

    let timer;
    const handleSearch = (search, country, page, kinds) => {
        setSearch(search);
        setCountry(country);

        if (String(search || '').trim().length > 2) {
            if (String(country || '').trim().length === 2) {
                setLoading(true);

                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    const limit = 12;
                    searchPlaces({ search, country, radius: 10000, kinds, limit, page })
                        .then(result => {
                            setCurrentPage(parseInt(result?.page) || 1);
                            setHasMore((result.limit * result.page) < result.total);

                            const list = searchResult;
                            (result.items || []).forEach(item => list.find(m => m.xid === item.id) || list.push(item));
                            setSearchResult(list);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }, 500);

                return;
            }
        }
    }

    const handleLoadMore = () => {
        if (hasMore) {
            handleSearch(search, country, currentPage + 1, kinds);
        }
    }

    useEffect(function () {
        setCurrentPage(1);
        handleLoadMore();
    }, [search, country, kinds]);

    return <div className='container py-4' data-testid="Search page">

        <h3 className='mb-4'>Search result of "{search}, {country}"</h3>

        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4'>
            {
                searchResult.map(item => <div className='col mb-3' key={item.xid}><GridItem item={item} autoHeight={true} shadow={true}></GridItem></div>)
            }

        </div>

        <div>
            {
                (!loading && !searchResult.length) ? <p role='status'>Nothing found</p> : ''
            }

            {
                loading
                    ? <div className='bg-light p-3'>
                        <span className="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
                        <span role="status">Searching...</span>
                    </div>
                    : (
                        hasMore
                            ? <button className='btn d-block btn-outline-secondary w-75 mx-auto' type='button' onClick={() => handleLoadMore()}>Load More</button>
                            : ''
                    )
            }
        </div>
    </div>

};