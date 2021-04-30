import React from 'react';
import styles from './styles/AboutUs.module.css';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

const aboutUs=()=>{
    return (
        <div className={styles.about_page}>
            <h1 className={styles.h1}><BubbleChartIcon/> About Us <BubbleChartIcon/> </h1>
            <hr></hr>
            <section className={styles.section}>
                <p>Due to this current pandemic, it's evident that Durga Pujo 2021 is not going to be the same as every year.</p>
                <p>However, in an effort to not let the spirit of Durga Puja fade away totally, we, a group of students from kolkata have taken the initiative to create an android app, Utsav through whichthe people of Bengali will be able to participate in the festivities, right from the safety of their homes.</p>
                <p>A viewer's choice award will be given to the best Pujo of 2021 based on publlic interaction</p>
            </section>
            <h2 className={styles.h2}>Features</h2>
            <ul>
                <li>Photos</li>
                <li>Locate various pujo</li>
                <li>Participation</li>
                <li>pre-Pujo updates</li>
            </ul>
        </div>
    );
}

export default aboutUs;
