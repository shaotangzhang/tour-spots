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

        return <div className="container py-4">
            <h3 className="mb-3" data-testid="User page">My account</h3>
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
        <section className="bg-light rounded border p-3 mb-4" aria-label="User info">
            <div className="mb-3"><label>Username:</label> <span className="form-control">{username}</span></div>
            <div className="mb-3"><label>Full name:</label> <span className="form-control">{fullName}</span></div>
            <div className="mb-3"><label>Email:</label> <span className="form-control">{email}</span></div>
        </section>

        <section className="mb-3" aria-label="User favourist list" hidden={!list?.length}>
            <h5>Favourists</h5>
            <div className="list-group" role="group">
                {
                    (list || []).map(item => <div className="list-group-item d-flex justify-content-between align-items-center" key={item.xid}>
                        <img className="img-thumbnail me-3" src={item.preview?.source} alt={item.name} style={{ width: 100 }} />
                        <div className="flex-grow-1">
                            <h6><a href={`/search/${item.xid}`} target={item.xid}>{item.name}, {item.address?.country}</a></h6>
                            <div role="status">{item.point?.lon}, {item.point?.lat}</div>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.xid)}>Remove</button>
                    </div>)
                }
            </div>
        </section>
    </>
}

export default User;