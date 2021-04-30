import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from "../config/firebase.js";
import { checkUser } from '../Utilities/checkUser';

/* Components */
import Navbar from '../Nav/nav.js';
import Sidebar1 from '../Sidebars//Sidebar_1.js';
import Trending from '../Others/Trending_hashtags.js';
import Sidebar2 from '../Sidebars/Sidebar_2.js';
import classes from './styles/communitytab.module.css';


function CommunityTab(props) {
    const user = props.user;
    const history = useHistory('');
    const [communitties, setCommunitties] = useState([]);
    const [search, setSearch] = useState('');
    const [searchOption, setSearchOption] = useState('small_name');
    const [message, setMessage] = useState('');
    const [showMoreCommunity, setShowMoreCommunity] = useState(true);
    
    const lang = props.lang;
    useEffect(() => {
        db.collection("Users").where('type', '==', 'com').orderBy(searchOption).limit(12).onSnapshot((snapshot) => {
            setCommunitties(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })));
        })
    }, [user, searchOption]);

    if (checkUser(user) === false)
        history.replace('/login');

    function community(currentValue) {

        if (user.length === 0)
            return '';
        else {
            return (
                <div key={currentValue.id} className="col-lg-4 col-6 p-1">
                    <div className={classes.community} onClick={() => viewProfile(currentValue.id)}>
                        <img src={currentValue.data.coverpic} alt={currentValue.data.name} className={classes.coverPic} />
                        <div className={classes.title}>
                            <p>{currentValue.data.name}</p>
                        </div>
                        <div>
                            <img src={currentValue.data.dp} alt="dp" className={classes.dp} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    function viewProfile(uid) {
        history.push("/profile/" + uid)
    }

    function SearchOptions(e) {
        setSearchOption(e.target.attributes.value.value);
    }

    function SearchFunction(e) {
        setSearch(e.target.value);
        setShowMoreCommunity(true);
    }

    function updateCommunityTab() {

        let last = '';
        if (searchOption === 'small_name')
            last = communitties[communitties.length - 1].data.small_name;
        if (searchOption === 'small_city')
            last = communitties[communitties.length - 1].data.small_city;
        if (searchOption === 'small_state')
            last = communitties[communitties.length - 1].data.small_state;

        setShowMoreCommunity(false);
        setMessage("Loading...");

        db.collection("Users").where('type', '==', 'com').orderBy(searchOption, 'asc').startAfter(last).limit(6).get()
            .then((snapshot) => {
                const array = snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                if (array.length === 0) {
                    setMessage('No more community to show.')
                }
                else {
                    setCommunitties([...communitties, ...array]);
                    setMessage('');
                    setShowMoreCommunity(true);
                }
            });
    }

    function showMore(entries) {

        if (entries[0] && entries[0].isIntersecting) {

            if (communitties[0])
                updateCommunityTab();
        }
    }

    let options = {
        rootMargin: '0px',
        threshold: 0.5
    }

    const element = document.getElementById('showMoreCommunity');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    if (communitties) {

        return (
            <div className={`container-fluid ${classes.communitytab}`}>
                <Navbar />
                <div className={classes.main}>
                    <Sidebar1 user={user} lang={lang}/>
                    {/* <Trending /> */}
                    <div className={`container ${classes.communitties}`} >
                        <div className={classes.searchbar}>
                            <input type="text" placeholder="Search..." value={search} onChange={SearchFunction} />

                            <div>
                                <span className={searchOption === "small_name" ? classes.active : ''} value="small_name" onClick={SearchOptions}>Name</span>
                                <span className={searchOption === "small_city" ? classes.active : ''} value="small_city" onClick={SearchOptions}>City/District</span>
                                <span className={searchOption === "small_state" ? classes.active : ''} value="small_state" onClick={SearchOptions}>State</span>
                            </div>
                        </div>
                        <hr style={{ margin: 0 }} />
                        <div className="row">
                            {communitties.filter((val) => {
                                if (search === '')
                                    return val;
                                else if (searchOption === "small_name" && val.data.small_name.includes(search.toLowerCase())) {
                                    return val;
                                }
                                else if (searchOption === "small_city" && val.data.small_city.includes(search.toLowerCase())) {
                                    return val;
                                }
                                else if (searchOption === "small_state" && val.data.small_state.includes(search.toLowerCase())) {
                                    return val;
                                }
                                return null;
                            })
                                .map(community)}
                        </div>
                    </div>
                    <Sidebar2 user={user} lang={lang}/>
                </div>
                {showMoreCommunity && <div id='showMoreCommunity'></div>}
                {message !== '' ? <p>{message}</p> : ''}
            </div>
        );
    }
    else {
        return <p className="text-center">Loading...</p>;
    }
}

export default CommunityTab;
