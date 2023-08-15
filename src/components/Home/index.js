import GridView from "./GridView";
import "./index.css";

import SearchForm from "../Search/SearchForm";
import OpenTripMap from "../../services/OpenTripMap";
import { useEffect, useState } from "react";

const Home = () => {

    const [nearBySpots, setNearBySpots] = useState(null);
    const [cityWideSpots, setCityWideSpots] = useState(null);
    const [nationWideSpots, setNationWideSpots] = useState(null);
    const [worldWideSpots, setWorldWideSpots] = useState(null);

    useEffect(function () {
        OpenTripMap.searchNearby(25000, 8)
            .then(result => setNearBySpots(result.items));

        OpenTripMap.searchNearby(100000, 8)
            .then(result => setCityWideSpots(result.items));

        OpenTripMap.searchNearby(250000, 8)
            .then(result => setNationWideSpots(result.items));

        Promise.all([
            { lat: 40.6976307, lon: -74.1448306, radius: 25000, limit: 10, page: 1 },
            { lat: 51.5287393, lon: -0.2667463, radius: 25000, limit: 10, page: 1 },
            { lat: 48.8589383, lon: 2.2644634, radius: 25000, limit: 10, page: 1 },
            { lat: -36.8594219, lon: 174.5409721, radius: 25000, limit: 10, page: 1 },
        ].map(location => OpenTripMap.searchRandom(location)))
            .then(items => setWorldWideSpots(items));

        /*
        New York:
40.6976307,-74.1448306

London:
51.5287393,-0.2667463

Paris:
48.8589383,2.2644634

Auckland
-36.8594219,174.5409721
*/
    }, []);

    return <>
        {/* <div className='container rounded-3 bg-light mb-5'>
            <SearchForm onSearch={() => true}></SearchForm>
        </div> */}
        <p>&nbsp;</p>

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