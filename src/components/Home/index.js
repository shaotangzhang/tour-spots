import GridView from "./GridView";
import "./index.css";

import SearchForm from "../Search/SearchForm";

const Home = () => {

    const countries = [
        { code: 'au', text: 'Australia' },
        { code: 'us', text: 'United States' }
    ];

    return <>
        <div className='container rounded-3 bg-light mb-5'>
            <SearchForm countries={countries}></SearchForm>
        </div>

        <section className="container mb-5">
            <h5 className="mb-3">Near by spots</h5>
            <GridView max={8}></GridView>
        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the city</h5>
            <GridView max={8}></GridView>
        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the country</h5>
            <GridView max={8}></GridView>
        </section>

        <section className="container mb-5">
            <h5 className="mb-3">Hot spots of the world</h5>
            <GridView max={4}></GridView>
        </section>
    </>
};

export default Home;