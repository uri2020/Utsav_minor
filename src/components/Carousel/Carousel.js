import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase.js';
import classes from './styles/carousel.module.css';

const ListItem = (props) => {
    return (
        <div className={(props.position === 1 ? "carousel-item active " : "carousel-item " + classes.borderRadius10) } >
            <img className={classes.carouselImg} src={props.imgsrc} alt="demo" />
        </div>
    );
}

const CarouselItem = (cvalue) => {
    return (
        <ListItem key={cvalue.position} imgsrc={cvalue.eventImage} link={cvalue.eventLink} position={cvalue.position} />
    );
}

const Indicator = (props) => {
    return (
        <li
            className={props.position === 1 ? "active" : ""}
            data-target="#slider"
            data-slide-to={props.index}>
        </li>
    );
}

const CarouselIndicators = (cvalue, index) => {
    return (
        <Indicator key={index.toString()} index={index} active={cvalue.active} />
    );
}

const Carousel = () => {

    let [carousel_data, setdata] = useState();

    useEffect(() => {

        let dt = [];

        async function getdata() {
            const db_data = await db.collection("Sliders").orderBy("position").get();
            db_data.docs.forEach((doc) => {
                dt.push(doc.data());
            })
            setdata(dt);
        }

        getdata();

    }, []);

    if (!carousel_data) {
        return <p>Loading...</p>
    }
    else {
        return (
            <div className={"carousel slide "+ classes.root} id="slider" data-ride="carousel" data-interval="4000" data-pause="hover">
                <div className={"carousel-inner "+classes.borderRadius10}>
                    {carousel_data.map(CarouselItem)}
                </div>

                <ol className={"carousel-indicators "+classes.indicators}>
                    {carousel_data.map(CarouselIndicators)}
                </ol>

                <a href="#slider" data-slide="prev" className="carousel-control-prev">
                    <span className="carousel-control-prev-icon"></span>
                </a>
                <a href="#slider" data-slide="next" className="carousel-control-next">
                    <span className="carousel-control-next-icon"></span>
                </a>

            </div>
        );
    }

}

export default Carousel;