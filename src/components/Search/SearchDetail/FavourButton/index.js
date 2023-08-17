import { useState } from "react";
import { observer } from "mobx-react";
import AuthStore from "../../../../stores/AuthStore";
import { getFavourists } from "../../../../services/Favourists";

const FavourButton = observer(({ item }) => {

    const [isLoggedIn] = useState(!!AuthStore?.userInfo?.username);
    if (!isLoggedIn) {
        return '';
    }

    const favourists = getFavourists(AuthStore?.userInfo?.username);

    const [isFavoured, setIsFavoured] = useState(favourists.has(item?.xid));

    const handleAddToFavor = toggle => {
        if (item?.xid) {
            if (toggle) {
                favourists.add(item);
            } else {
                favourists.remove(item?.xid);
            }
            setIsFavoured(toggle);
        }
    }

    return isFavoured
        ? <button className="btn btn-outline-danger" onClick={() => handleAddToFavor(false)}>Remove favor</button>
        : <button className="btn btn-outline-secondary" onClick={() => handleAddToFavor(true)}>Add to favor</button>
});

export default FavourButton;