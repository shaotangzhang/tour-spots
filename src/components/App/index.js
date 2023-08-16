import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { getApiProxyToken } from '../../services';
import Header from './Header';
import Footer from './Footer';
import Error404 from "./Error404";
import Search from '../Search';
import SearchDetail from '../Search/SearchDetail';
import User from '../User';
import Home from '../Home';
import Login from '../Login';
import Logout from '../Login/Logout';
import Register from '../Login/Register';


export default function App() {

    useEffect(function () {
        getApiProxyToken();

        return function () {
            // unloaded
        };
    }, [])

    return <BrowserRouter>
        <header className="layout-header">
            <Header></Header>
        </header>

        <main style={{ minHeight: '70vh' }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:xid" element={<SearchDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/*" element={<User />} />
                <Route path="*" element={<Error404></Error404>} />
            </Routes>
        </main>

        <footer className="layout-footer">
            <Footer></Footer>
        </footer>
    </BrowserRouter>
};