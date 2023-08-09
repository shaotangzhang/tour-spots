import { useLocation } from 'react-router-dom';

import "./index.css";

import GridView from "../Home/GridView";
import SearchForm from "./SearchForm";
import { useEffect, useState } from 'react';

const countries = [
    { code: 'au', text: 'Australia' },
    { code: 'us', text: 'United States' }
];

const Search = () => {

    const location = useLocation();
    const [country, setCountry] = useState('au');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    useEffect(function () {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        const country = params.get('country');
        setCountry(country);
        setSearch(search);
    }, [location.search]);

    useEffect(function () {
        if (!search || !country) {
            setSearchResult(null);
        } else {
            setSearchResult([1, 2, 3]);
        }
    }, [search, country]);

    return <>
        <div className='container rounded-3 bg-light mb-5'>
            <SearchForm countries={countries} country={country} search={search}></SearchForm>
        </div>

        <section className="container mb-5" hidden={!searchResult}>
            <h5 className="mb-3">Search results</h5>
            <GridView max={24}></GridView>
        </section>
    </>
};

export default Search;