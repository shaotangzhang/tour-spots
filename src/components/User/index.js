import { useLocation } from "react-router";
import "./index.css";
import Auth from "../../services/Auth";
import AuthStore from "../../stores/AuthStore";
import Login from "../Login";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { observer } from "mobx-react";
import OpenTripMap from "../../services/OpenTripMap";
import { useState } from "react";

const User = () => {
    const location = useLocation();

    if (Auth.isUserLogin()) {

        return <Container>
            <h3 className="mt-3">My account</h3>
            <Routes>
                <Route path="/" element={<UserProfile />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="favourists" element={<UserFavourList />} />
                <Route path="*" element={<UserPageNotFound />} />
            </Routes>
        </Container>
    }

    return <Login redirectUrl={location.pathname}></Login>
};

const UserPageNotFound = () => {
    return <p>Page is not found.</p>
}

const UserProfile = () => {

    const { email, username, fullName } = AuthStore.userInfo;

    const [list, setList] = useState(OpenTripMap.getFavors() || []);

    const handleRemove = (xid) => {
        if (window.confirm('Do you really want to remove this spot?')) {
            OpenTripMap.removeFavor(xid);

            const pos = list?.findIndex(item => item.xid === xid);
            if (pos >= 0) {
                setList([...list.slice(0, pos), ...list.slice(pos + 1)]);
            }
        }
    }

    return <>
        <div className="bg-light p-3 mb-3">
            <p><label>Username:</label> {username}</p>
            <p><label>Full name:</label> {fullName}</p>
            <p><label>Email:</label> {email}</p>
        </div>

        <section className="mb-3">
            <h5>Favourists</h5>
            <div className="list-group">
                {
                    (list || []).map(item => <div className="list-group-item d-flex justify-content-between align-items-center" key={item.xid}>
                        <img src={item.preview?.source} className="img-thumbnail me-3" style={{width: 100}}/>
                        <div className="flex-grow-1">
                            <h6><a href={`/search/${item.xid}`} target={item.xid}>{item.name}, {item.address?.country}</a></h6>
                            <div>{item.point?.lon}, {item.point?.lat}</div>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.xid)}>Remove</button>
                    </div>)
                }
            </div>
        </section>
    </>
}

const UserFavourList = () => {

    return <ul><li>favourist item</li></ul>
}

export default observer(User);