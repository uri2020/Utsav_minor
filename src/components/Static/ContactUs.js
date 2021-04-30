import React from 'react';
import classes from './styles/ContactUs.module.css';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import RoomIcon from '@material-ui/icons/Room';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

const contactUs=()=>{
    return (
        <section className={classes.contact}>
            <div className={classes.content}>
                <h1><BubbleChartIcon/> Contact Us <BubbleChartIcon/></h1>
                <h4>Contact for Premium App Development Services</h4>
            </div>
            <div className="container">
                <div className="contactInfo">
                    <div className={classes.box}>
                        <div className={`${classes.icon} ${classes.top}`}><RoomIcon/></div>
                        <div className={classes.text}>
                            <h3><strong>Address</strong></h3>
                            <p>Salt Lake, Sector-5 ,Kolkata ,West Bengal, India</p>
                        </div>
                    </div>
                    <div className={classes.box}>
                        <div className={classes.icon}><PhoneIcon/></div>
                        <div className={classes.text}>
                            <h3>Phone</h3>
                            <p>+91-6290438875</p>
                        </div>
                    </div>
                    <div className={classes.box}>
                        <div className={classes.icon}><EmailIcon/></div>
                        <div className={classes.text}>
                            <h3>Email</h3>
                            <p>contact@applex.in</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default contactUs;
