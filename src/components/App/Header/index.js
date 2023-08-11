import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import AuthStore from "../../../stores/AuthStore";
import "./index.css";
import { observer } from 'mobx-react';

const Header = () => {

    return <header className="layout-header">
        <Navbar
            expand="lg"
            variant="light"
            sticky="top"
            className="border-bottom"
            style={{ top: 0 }}>

            <Container>
                <Navbar.Brand href="/">Tour Spots</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto">
                        {
                            AuthStore.isUserLoggedIn
                                ? <>
                                    <NavDropdown title="My Account" id="user-nav-dropdown">
                                        <NavDropdown.Item href="/user/profile">User profile</NavDropdown.Item>
                                        <NavDropdown.Item href="/user/favourists">Favourists</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                                : <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Container>

        </Navbar>
    </header>
};

export default observer(Header);