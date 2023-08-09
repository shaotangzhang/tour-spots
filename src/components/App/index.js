import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from "./Footer";
import Header from "./Header";
import Home from "../Home";
import Login from "../Login";
import Register from "../Login/Register";
import Error404 from "./Error404";
import About from "../About";

const App = () => {
    return <BrowserRouter>
        <RecoilRoot>
            <Header></Header>
            <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about/:name" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Error404></Error404>} />
            </Routes>
            </main>
            <Footer></Footer>
        </RecoilRoot>
    </BrowserRouter>
};

export default App;