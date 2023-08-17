import { useState } from "react";
import { observer } from "mobx-react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "../Login";
import AuthStore from "../../stores/AuthStore";
import Error404 from "../App/Error404";
import { getFavourists } from "../../services/Favourists";

const User = observer(() => {

    const [isLoggedIn] = useState(!!AuthStore?.userInfo?.username);

    if (isLoggedIn) {

        return <div className="container">
            <h3 className="mt-3" data-testid="User page">My account</h3>
            <Routes>
                <Route path="/" element={<UserProfile userInfo={AuthStore.userInfo} />} />
                <Route path="/profile" element={<UserProfile userInfo={AuthStore.userInfo} />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </div>
    }

    return <Login></Login>
});

const UserProfile = ({ userInfo }) => {

    const favourists = getFavourists(userInfo?.username);
    const { email, username, fullName } = userInfo || {};
    const [list, setList] = useState(favourists.getList());

    const handleRemove = (xid) => {
        if (window.confirm('Do you really want to remove this spot?')) {
            favourists.remove(xid);

            setList(favourists.getList());
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
                        <img src={item.preview?.source} className="img-thumbnail me-3" alt={item.name} style={{ width: 100 }} />
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

export default User;