import { useParams } from "react-router";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";

import "./index.css";

const DOCUMENTS = {};

const About = () => {

    const { name } = useParams();
    const [document, setDocument] = useState('');

    useEffect(function () {

        if (name in DOCUMENTS) {
            setDocument(DOCUMENTS[name]);
        } else {
            import('./docs/' + name + '.js').then(doc => {
                setDocument(DOCUMENTS[name] = doc.default)
            }).catch(ex => {
                setDocument('Page is not found');
            });
        }

    }, [name]);

    return <Container data-testid='About page'>{document || 'Page is not found'}</Container>
};

export default About;