import React from 'react';
import classes from './styles/preloader.module.css';
import gif from "../images/preloader.svg";

function Preloader() {

    return (
        <div className={classes.preloader}>
            <img src={gif} alt="Loading..." width="60" height="60" />
        </div>
    );
}

export default Preloader;