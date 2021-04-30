import React from 'react';
import './styles/Trending_hashtags.css';
import Translate from '../Translate/Translate';
const data = ["utsav", "utsav-app", "durga puja", "trending"];
/* The data for trending hashtags is expected to be an Array of Strings without '#' tag */

const hash_list = (cvalue, index) => {
    return (
        <li key={index.toString()}> #{cvalue}</li>
    );
}

const Trending = (props) => {
    const lang = props.lang;
    
    return (
        <div className="trending">
            <h5 className="trending-heading"><Translate lang={lang}>Trending Hashtags</Translate></h5>
            <ul className="trending-list">
                {data.map(hash_list)}
            </ul>
        </div>
    );
}

export default Trending;