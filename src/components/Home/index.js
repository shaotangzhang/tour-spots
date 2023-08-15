import GridView from "./GridView";
import { useEffect, useState } from "react";
import "./index.css";

import OpenTripMap from "../../services/OpenTripMap";
import Storage from "../../services/storage";

const cachedItems = Storage.getObject('home.cache') || {};

const Home = () => {

    const [nearBySpots, setNearBySpots] = useState(cachedItems['near']);
    const [cityWideSpots, setCityWideSpots] = useState(cachedItems['city']);
    const [nationWideSpots, setNationWideSpots] = useState(cachedItems['nation']);
    const [worldWideSpots, setWorldWideSpots] = useState(cachedItems['world']);

    useEffect(function () {
        if (!(cachedItems['near']?.length)) {
            OpenTripMap.searchNearby(25000, 8)
                .then(result => {
                    setNearBySpots(result.items);
                    cachedItems['near'] = result.items;
                    Storage.setObject('home.cache', cachedItems);
                });
        }

        if (!(cachedItems['city']?.length)) {
            OpenTripMap.searchNearby(100000, 8)
                .then(result => {
                    setCityWideSpots(result.items);
                    cachedItems['city'] = result.items;
                    Storage.setObject('home.cache', cachedItems);
                });
        }

        if (!(cachedItems['nation']?.length)) {
            OpenTripMap.searchNearby(250000, 8)
                .then(result => {
                    setNationWideSpots(result.items);
                    cachedItems['nation'] = result.items;
                    Storage.setObject('home.cache', cachedItems);
                });
        }

        if (!(cachedItems['world']?.length)) {
            Promise.all([
                { lat: 40.6976307, lon: -74.1448306, radius: 25000, limit: 10, page: 1 },
                { lat: 51.5287393, lon: -0.2667463, radius: 25000, limit: 10, page: 1 },
                { lat: 48.8589383, lon: 2.2644634, radius: 25000, limit: 10, page: 1 },
                { lat: -36.8594219, lon: 174.5409721, radius: 25000, limit: 10, page: 1 },
            ].map(location => OpenTripMap.searchRandom(location)))
                .then(items => {
                    setWorldWideSpots(items);
                    cachedItems['world'] = items;
                    Storage.setObject('home.cache', cachedItems);
                });
        }
    }, []);

    return <>
        {/* <div className='container rounded-3 bg-light mb-5'>
            <SearchForm onSearch={() => true}></SearchForm>
        </div> */}
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
    </>
};

export default Home;