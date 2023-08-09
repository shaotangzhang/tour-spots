import { useParams } from "react-router";
import { Container } from "react-bootstrap";

import "./index.css";

const About = () => {

    const { name } = useParams();

    return <Container>
        <h3>About {(name || '').toString().replace('-', ' ')}</h3>
        <p style={{minHeight: '50vh'}}></p>
    </Container>
};

export default About;