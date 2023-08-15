import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import SearchForm from "./SearchForm";

import "./index.css";

import OpenTripMap from '../../services/OpenTripMap';
import GridView from '../Home/GridView';

export default function Search() {
    const location = useLocation();

    const [country, setCountry] = useState('au');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(function () {
        const params = new URLSearchParams(location.search);
        setCountry(params.get('country'));
        setSearch(params.get('search'));
        setCurrentPage(parseInt(params.get('page')) || 1);
    }, [location.search]);

    useEffect(function () {
        setCurrentPage(1);
        handleSearch(search, country);
    }, [search, country]);

    let timer;

    const handleSearch = (search, country, radius, page) => {

        if (!search || !country) {
            setSearchResult(null);
            setLoading(false);
            return;
        }

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            setLoading(true);

            OpenTripMap.search({ search, country, radius: radius || 25000, limit: 12, page })
                .then(result => {
                    const list = [...searchResult || []];
                    result.items.forEach(item => list.find(e => (e.xid === item.xid) || (e.name === item.name) || (e.image && (e.image === item.image))) || list.push(item));
                    setSearchResult(list);
                })
                // .catch(ex => alert(ex), setSearchResult(null))
                .finally(() => {
                    setLoading(false);
                });
        }, 500);
    };

    const handleLoadMore = () => {
        setLoading(true);
        const page = currentPage;
        setCurrentPage(page + 1);
        handleSearch(search, country, null, page + 1);
    };

    return <>
        <div className='container rounded-3 bg-light mb-5' data-testid="Search page">
            <SearchForm country={country} search={search} onSearch={handleSearch} showExtra={true}></SearchForm>
        </div>

        <div className='container mb-3'>

            <div className='bg-light p-3' hidden={!loading}>
                <span className="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
                <span role="status">Searching...</span>
            </div>

            {
                (searchResult?.length > 0)
                    ? <GridView items={searchResult}></GridView>
                    : (loading ? '' : <p>Not found any spots.</p>)
            }

            <div hidden={loading || !searchResult?.length}>
                <button className='btn d-block btn-outline-secondary w-75 mx-auto' type='button' onClick={() => handleLoadMore()}>Load More</button>
            </div>
        </div>
    </>
};