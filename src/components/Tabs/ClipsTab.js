import React from 'react';
import { checkUser } from '../Utilities/checkUser';

/* Components */
import Posts from '../Posts/Posts.js';
import Navbar from '../Nav/nav.js';
import Sidebar1 from '../Sidebars/Sidebar_1.js';
import Trending from '../Others/Trending_hashtags.js';
import Sidebar2 from '../Sidebars/Sidebar_2.js';
import classes from './styles/clipstab.module.css';
import { useHistory } from 'react-router';

function ClipsTab(props) {

    const history = useHistory();
    const user = props.user;
    const lang = props.lang;
    if (checkUser(user) === false)
        history.replace('/login');

    if (user.length === 0)
        return '';
    else {
        return (
            <div className={`container-fluid ${classes.clipstab}`}>
                <Navbar />
                <div className={classes.main}>
                    <Sidebar1 user={user} lang={lang} />
                    {/* <Trending /> */}
                    <div className={classes.posts}>
                        <Posts user={user} posttype="" clips={true} lang={lang}/>
                    </div>
                    <Sidebar2 user={user} lang={lang}/>
                </div>
            </div>
        );
    }
}

export default ClipsTab;
