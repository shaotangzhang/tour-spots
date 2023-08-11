import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./index.css";

const Footer = () => {

    return <footer className="layout-footer">
        <Container className="text-center">
            <p>
                <Link to={'/about/terms-of-use'}>Terms of Use</Link> |
                <Link to={'/about/privacy-policy'}>Privacy Policy</Link> |
                <Link to={'/about/contact-us'}>Contact Us</Link>
            </p>

            <p className="text-muted"> Copyright reserved &copy; {window.location.hostname} </p>
        </Container>
    </footer>;
};

export default Footer;