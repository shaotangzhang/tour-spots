import { observer } from 'mobx-react';
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import AuthStore from "../../../stores/AuthStore";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { computed } from 'mobx';

const Header = observer(({ onSearch }) => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const isUserLoggedIn = computed(()=>!!AuthStore?.userInfo?.username);

    const [search, setSearch] = useState(queryParams.get('search') || '');
    const [country, setCountry] = useState(queryParams.get('country') || 'au');
    const [isLoggedIn, setIsLoggedIn] = useState(!!AuthStore?.userInfo?.username);

    const handleSearch = e => {

        const { search, country } = e.target;
        setSearch(search.value);
        setCountry(country.value);

        if (typeof onSearch === "function") {
            return onSearch(search.value, country.value);
        }

        return true;
    };

    const handleSearchChanged = e => {
        setSearch(e.target.value);
    };

    const handleCountryChanged = e => {
        setCountry(e.target.value);
    };

    return <Navbar
        expand="lg"
        variant="light"
        sticky="top"
        className="border-bottom"
        style={{ top: 0 }}>

        <Container className="py-3">
            <Navbar.Brand href="/">Tour Spots</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">

                <Nav className="me-3 order-first">
                    <Nav.Link href="/">Home</Nav.Link>                    
                </Nav>

                <form className="me-auto input-group" role="search" method="GET" action="/search" onSubmit={e => handleSearch(e)}>
                    <input name="search" className="form-control me-2" type="search"
                        value={search || ''} onChange={e => handleSearchChanged(e)}
                        pattern="^\s*(\S(.*\S|\S.*)\S)\s*$" 
                        title="Please enter a name with no less than 3 characters"
                        placeholder="Enter the place name for seaching" aria-label="Search" required />
                    <select name="country" className='form-select me-2' style={{ maxWidth: 150 }}
                        value={country || 'au'} onChange={e => handleCountryChanged(e)}>
                        <optgroup label="Africa">
                            <option value="eg">Egypt</option>
                            <option value="ke">Kenya</option>
                            <option value="ma">Morocco</option>
                            <option value="mu">Mauritius</option>
                            <option value="za">South Africa</option>
                        </optgroup>
                        <optgroup label="Asia">
                            <option value="ae">United Arab Emirates</option>
                            <option value="cn">China</option>
                            <option value="id">Indonesia</option>
                            <option value="in">India</option>
                            <option value="jp">Japan</option>
                            <option value="kr">South Korea</option>
                            <option value="my">Malaysia</option>
                            <option value="ph">Philippines</option>
                            <option value="sg">Singapore</option>
                            <option value="th">Thailand</option>
                            <option value="vn">Vietnam</option>
                        </optgroup>
                        <optgroup label="Europe">
                            <option value="at">Austria</option>
                            <option value="be">Belgium</option>
                            <option value="cz">Czech Republic</option>
                            <option value="de">Germany</option>
                            <option value="dk">Denmark</option>
                            <option value="es">Spain</option>
                            <option value="fi">Finland</option>
                            <option value="fr">France</option>
                            <option value="gr">Greece</option>
                            <option value="hu">Hungary</option>
                            <option value="ie">Ireland</option>
                            <option value="it">Italy</option>
                            <option value="nl">Netherlands</option>
                            <option value="no">Norway</option>
                            <option value="pl">Poland</option>
                            <option value="pt">Portugal</option>
                            <option value="se">Sweden</option>
                            <option value="tr">Turkey</option>
                            <option value="uk">United Kingdom</option>
                        </optgroup>
                        <optgroup label="North America">
                            <option value="ca">Canada</option>
                            <option value="mx">Mexico</option>
                            <option value="us">United States</option>
                        </optgroup>
                        <optgroup label="Oceania">
                            <option value="au">Australia</option>
                            <option value="nz">New Zealand</option>
                        </optgroup>
                        <optgroup label="South America">
                            <option value="ar">Argentina</option>
                            <option value="br">Brazil</option>
                            <option value="cl">Chile</option>
                            <option value="co">Colombia</option>
                            <option value="pe">Peru</option>
                        </optgroup>
                    </select>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>

                <Nav className="ms-auto">
                    {
                        AuthStore.userInfo?.username
                            ? <>
                                <NavDropdown title="My Account" id="user-nav-dropdown">
                                    <NavDropdown.Item href="/user/profile">User profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                                </NavDropdown>
                            </>
                            : <>
                                <Nav.Link href="/user">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                            </>
                    }
                </Nav>

            </Navbar.Collapse>
        </Container>

    </Navbar>
});

export default Header;