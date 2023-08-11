import { useLocation } from "react-router";
import "./index.css";
import Auth from "../../services/Auth";
import Login from "../Login";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { observer } from "mobx-react";

const User = () => {
    const location = useLocation();

    if (Auth.isUserLogin()) {

        return <Container>
            <h3>My account</h3>
            <Routes>
                <Route path="/" element={<UserDashboard />} />
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

const UserDashboard = () => {

    return <p>User dashboard</p>
}

const UserProfile = () => {

    return <p>User profiel</p>
}

const UserFavourList = () => {

    return <ul><li>favourist item</li></ul>
}

export default observer(User);