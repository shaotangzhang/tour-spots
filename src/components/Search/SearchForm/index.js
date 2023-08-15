import { useEffect, useState } from "react";
import "./index.css";

import OpenTripMap from "../../../services/OpenTripMap";

const COUNTRIES = [
    { code: 'au', text: 'Australia' },
    { code: 'us', text: 'United States' }
];

export default function SearchForm({ search, country, countries, onSearch, showExtra }) {

    const [keyword, setKeyword] = useState(search || '');
    const [region, setRegion] = useState(country || 'au');

    useEffect(function () {
        setKeyword(search);
        setRegion(country);
        onSearch(search, country);
    }, [search, country]);

    const handleFormSearch = e => {

        const { search, country } = e.target;

        if (typeof onSearch === 'function') {
            return onSearch(search, country, e);
        }

        e.preventDefault();
        e.stopPropagation();

        setKeyword(search.value);
        setRegion(country.value);
        onSearch(search.value, country.value);

        return false;
    };

    return <form
        method="GET"
        action="/search"
        onSubmit={handleFormSearch}
        className="d-flex justify-content-center align-items-center p-5 m-3">

        <div className="row g-1 p-4 rounded-3 search_form_body">
            <h6 className="text-muted">Search for tour spots:</h6>
            <div className="col-12 col-md-7">
                <input
                    className="form-control"
                    type="search"
                    name="search"
                    value={keyword || ''}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Enter a location, such as &quot;Melbourne&quot;"
                    required />
            </div>
            <div className="col-12 col-md-3">
                <select className="form-select" name="country" value={region || ''} onChange={e => setRegion(e.target.value)}>
                    {
                        (countries || COUNTRIES).map(({ text, code }) => <option key={code} value={code}>{text}</option>)
                    }
                </select>
            </div>
            <div className="col-12 col-md-2">
                <button className="btn btn-outline-secondary" type="submit">Search</button>
            </div>
        </div>

        <div hidden={!showExtra}>
            {
                OpenTripMap.getValidSearches().map(value => <span>{value}</span>)
            }
        </div>
    </form>
};