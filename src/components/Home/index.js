import { useEffect, useState } from "react";
import "./index.css";

import { searchNearby, searchRandom } from "../../services/Places";
import GridView from "../Place/GridView";

let __CACHE__ = JSON.parse(localStorage.getItem('HOME_ITEMS')) || {};
if (typeof __CACHE__ !== 'object') __CACHE__ = {};
const storeSpots = (key, items) => {
    __CACHE__[key] = items;
    localStorage.setItem('HOME_ITEMS::' + key, JSON.stringify(items));
}

const Home = () => {

    const [nearBySpots, setNearBySpots] = useState(__CACHE__['near']);
    const [cityWideSpots, setCityWideSpots] = useState(__CACHE__['city']);
    const [nationWideSpots, setNationWideSpots] = useState(__CACHE__['nation']);
    const [worldWideSpots, setWorldWideSpots] = useState(__CACHE__['world']);

    useEffect(function () {
        if (!(__CACHE__['near']?.length)) {
            searchNearby(25000, 6)
                .then(result => {
                    setNearBySpots(result.items);
                    storeSpots('near', result.items);
                });
        }

        if (!(__CACHE__['city']?.length)) {
            searchNearby(100000, 6)
                .then(result => {
                    setCityWideSpots(result.items);
                    storeSpots('city', result.items);
                });
        }

        if (!(__CACHE__['nation']?.length)) {
            searchNearby(250000, 8)
                .then(result => {
                    setNationWideSpots(result.items);
                    storeSpots('nation', result.items);
                });
        }

        if (!(__CACHE__['world']?.length)) {
            Promise.all([
                { lat: 40.6976307, lon: -74.1448306 },
                { lat: 51.5287393, lon: -0.2667463 },
                { lat: 48.8589383, lon: 2.2644634 },
                { lat: -36.8594219, lon: 174.5409721 },
            ].map(location => searchRandom(location, { radius: 25000, limit: 10, page: 1 })))
                .then(items => {
                    setWorldWideSpots(items);
                    storeSpots('world', items);
                });
        }
    }, []);

    return <div className="container">

        <p data-testid="Home page">&nbsp;</p>

        <section className="container mb-5">
            <h5 className="mb-3">Nearby spots</h5>
            {
                nearBySpots
                    ? <GridView items={nearBySpots} maxCount={4}></GridView>
                    : <p className="bg-light p-1 px-3">Loading ...</p>
            }

        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the city</h5>
            {
                cityWideSpots
                    ? <GridView items={cityWideSpots} maxCount={4}></GridView>
                    : <p className="bg-light p-1 px-3">Loading ...</p>
            }

        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the country</h5>
            {
                nationWideSpots
                    ? <GridView items={nationWideSpots} maxCount={4}></GridView>
                    : <p className="bg-light p-1 px-3">Loading ...</p>
            }

        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the world</h5>
            {
                worldWideSpots
                    ? <GridView items={worldWideSpots} maxCount={4}></GridView>
                    : <p className="bg-light p-1 px-3">Loading ...</p>
            }

        </section>
    </div>
};

export default Home;