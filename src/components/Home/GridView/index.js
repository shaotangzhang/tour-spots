// import classNames from "classnames";
// import styles from "./index.css";
import GridItem from "./GridItem";

export default function GridView({ items, maxCount=500 }) {

    return <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4' data-testid="Grid view">
        {
            (items||[]).filter(item=>item.xid && item.name).slice(0, maxCount).map(item => <div className='col mb-3' key={item.xid}>
                <GridItem
                    xid={item.xid}
                    image={item.preview?.source}
                    title={(item.wikipedia_extracts?.title || '').replace(/[a-z]+\:/, '') || item.name}
                    description={item.info || item.wikipedia_extracts?.text}
                    rating={item.rate}
                    country={item.address?.country}
                />
            </div>)
        }
    </div>
};