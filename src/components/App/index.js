import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from "./Footer";
import Header from "./Header";
import Home from "../Home";
import Login from "../Login";
import Logout from "../Login/Logout";
import Register from "../Login/Register";
import Error404 from "./Error404";
import About from "../About";
import Search from "../Search";
import SearchDetail from "../Search/SearchDetail";
import User from "../User";

const App = () => {
    return <BrowserRouter>
        <Header></Header>
        <main className="layout-body">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about/:name" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:xid" element={<SearchDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/*" element={<User />} />
                <Route path="*" element={<Error404></Error404>} />
            </Routes>
        </main>
        <Footer></Footer>
    </BrowserRouter>
};

export default App;