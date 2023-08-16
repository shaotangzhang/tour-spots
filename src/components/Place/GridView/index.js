import GridItem from "../GridItem";

export default function GridView({ items, maxCount }) {

    if ((maxCount = parseInt(maxCount)) > 0) {
        items = items.slice(0, maxCount);
    }

    return <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4'>
        {
            items.map(item => <div className='col mb-3' key={item.xid}><GridItem item={item} autoHeight={true} shadow={true}></GridItem></div>)
        }

    </div>
}