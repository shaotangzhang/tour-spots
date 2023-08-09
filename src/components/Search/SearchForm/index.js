import { useEffect, useState } from "react";
import "./index.css";

export default function SearchForm({ search, country, countries, onSearch }) {

    const [keyword, setKeyword] = useState(search || '');
    const [region, setRegion] = useState(country || 'au');

    useEffect(function () {
        setKeyword(search);
        setRegion(country);
    }, [search, country]);   

    const handleFormSearch = e => {
        if (typeof onSearch === "function") {
            e.preventDefault();
            e.stopPropagation();
            return onSearch(e);
        } else {
            return true;
        }
    };

    return <form
        method="GET"
        action="/search"
        onSubmit={handleFormSearch}
        className="d-flex justify-content-center align-items-center p-5 m-3">

        <div className="row g-1 p-4 w-75 rounded-3 search_form_body">
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
                        countries.map(({ text, code }) => <option key={code} value={code}>{text}</option>)
                    }
                </select>
            </div>
            <div className="col-12 col-md-2">
                <button className="btn btn-outline-secondary" type="submit">Search</button>
            </div>
        </div>

    </form>
};