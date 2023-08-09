import classNames from "classnames";
import styles from "./index.css";


import Carousel from 'react-bootstrap/Carousel';

export default function Hero() {

    return <div className={classNames(styles.DEFAULT_CLASS, 'container', styles.EXTRA_CLASS)}>
        <Carousel>
            <Carousel.Item>
                <div className="carousel-inner-container">
                    <div className="carousel-slide">Slide 1</div>
                    <div className="carousel-slide">Slide 2</div>
                    <div className="carousel-slide">Slide 3</div>
                    <div className="carousel-slide">Slide 4</div>
                    <div className="carousel-slide">Slide 5</div>
                    <div className="carousel-slide">Slide 6</div>
                </div>
            </Carousel.Item>
        </Carousel>
    </div>
};