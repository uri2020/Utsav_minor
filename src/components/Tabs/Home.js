import React, { useState, useEffect, Component } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../config/firebase.js';
import { checkUser } from '../Utilities/checkUser';   
/* Components */
import Posts from '../Posts/Posts.js';
import Navbar from '../Nav/nav.js';
import Sidebar1 from '../Sidebars/Sidebar_1.js';
import Trending from '../Others/Trending_hashtags.js';
import Sidebar2 from '../Sidebars/Sidebar_2.js';
import Carousel from '../Carousel//Carousel.js';
import Preloader from '../Others/Preloader';
import './styles/Home.css';

function Home(props) {

    const [user, setUser] = useState(props.user);
    const [splashVisible, setSplashVisible] = useState(true);
    const [username, setUsername] = useState(localStorage.getItem("Username"));
    const history = useHistory();
    const flag = (history.location.state === undefined || history.location.state === null) ? null : history.location.state.googleSignin;
    const lang = props.lang;
    // console.log(user);
    // console.log(localStorage.getItem("Username"));
    function Hide_Splash_Screen() {  
       setSplashVisible(false); 
      }  
    useEffect(() => {

        setUser(props.user);
    }, [props.user]);
    useEffect(() => {
        setTimeout(function(){  
         Hide_Splash_Screen();  
          }, 5000);  
    })
    useEffect(() => {

        if (user && user.uid !== '' && localStorage.getItem("Username") === null) {
            db.collection("Users").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();

                        localStorage.setItem('Username', data.name);
                        localStorage.setItem('Dp', data.dp);
                        localStorage.setItem('type', data.type);
                        if (data.type === 'indi')
                            localStorage.setItem('gender', data.gender);
                        if (data.type === 'com')
                            localStorage.setItem('upvotes', data.upvotes);
                        localStorage.setItem('city', data.city);
                        localStorage.setItem('visits', data.visits);
                        localStorage.setItem('follows', data.follows);
                        setUsername(data.name);
                    }
                });
        }
    }, [user]);
    
    if (user && username) {

        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (event) {
            history.go(1);
        };

        return (
            <>
            
            <div className="container-fluid home">
                <Navbar user={user} />
                <div className="home-main">
                    <Sidebar1 user={user} lang={lang} />
                    <div className="app__posts">
                        {/* <Carousel /> */}
                        <Posts user={user} posttype="com" clips={false} lang={lang} />
                    </div>
                    <Sidebar2 user={user} lang={lang} />
                </div>
            </div>
            </>
            
        );
    }

    if (flag === null && user.length === 0) {
        history.replace('/onboarding');
        return ""
    }
    else if (flag) {
        if (checkUser(user) === false)
            history.replace('/onboarding');

        if (user.length === 0)
            return '';
        else {

            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function (event) {
                history.go(1);
            };

            return (
                <>
                 
                <div className="container-fluid home">
                    <Navbar user={user} />

                    <div className="home-main">
                        <Sidebar1 user={user} lang={lang} />
                        <Trending lang={lang} />

                        <div className="app__posts">
                            {/* <Carousel /> */}
                            <Posts user={user} posttype="com" clips={false} lang={lang} />
                        </div>
                        <Sidebar2 user={user} lang={lang} />
                    </div>
                </div>
                </>
            );
        }
    }
    else if (!user || username === null) {
        return (
            <>
            <Preloader />
            </>
        );
    }
}

export default Home;
