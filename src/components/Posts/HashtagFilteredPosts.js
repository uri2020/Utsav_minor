import React, { useState, useEffect } from 'react';
import { db } from "../config/firebase.js";
import { useHistory, useParams } from 'react-router-dom';
import { checkUser } from '../Utilities/checkUser';

import Post from '../Posts/Post.js';
import Navbar from '../Nav/nav.js';
import Sidebar1 from '../Sidebars/Sidebar_1.js';
import Sidebar2 from '../Sidebars/Sidebar_2.js';

import classes from '../Tabs/styles/peopletab.module.css';


function Posts({ userId, hashtag }) {
    const [Feeds, setFeeds] = useState([]);
    const uid = userId;
    const name = localStorage.getItem("Username");
    const dp = localStorage.getItem("Dp");
    const type = localStorage.getItem("type");
    const [message, setMessage] = useState('');
    const [showMorePost, setShowMorePost] = useState(true);


    // the max. post limit is 4. It need to be changed to 10.
    useEffect(() => {

        db.collection('Feeds').where("tagList", "array-contains", hashtag).orderBy('ts', 'desc').limit(4).onSnapshot(snapshot => {
            setFeeds(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data(),
            })));
            setShowMorePost(true);
        });

    }, []);

    function showMore(entries) {

        if (entries[0] && entries[0].isIntersecting) {

            if (Feeds[0])
                updateFeeds();
        }
    }

    let options = {
        rootMargin: '0px',
        threshold: 0.2
    }

    const element = document.getElementById('showMorePost');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    function updateFeeds() {
        const last = Feeds[Feeds.length - 1].post.ts;
        setShowMorePost(false);
        //setMessage("Loading...");

        db.collection('Feeds').where("tagList", "array-contains", hashtag).orderBy('ts', 'desc').startAfter(last).limit(4).get()
            .then((snapshot) => {
                const array = snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                }));
                if (array.length === 0) {
                    setMessage('No more posts to show.')
                }
                else {
                    setFeeds([...Feeds, ...array]);
                    setMessage('');
                    setShowMorePost(true);
                }
            });
    }


    if (Feeds[0] && name && dp) {
        return (
            <div className="Feeds">

                {
                    Feeds.map(({ id, post }) => (
                        <Post
                            key={id}
                            postId={id}
                            origuid={uid}
                            origusertype={type}
                            origusername={name}
                            origuserdp={dp}
                            userId={post.uid}
                            postusername={post.username}
                            postuserdp={post.userdp}
                            txt={post.txt}
                            img={post.img}
                            video={post.video}
                            clips={false}
                            likecount={post.likecount}
                            commentcount={post.cmtNo}
                        />
                    ))
                }
                <div>
                    {showMorePost && <div id='showMorePost'>Loading...</div>}
                    {message !== '' ? <p>{message}</p> : ''}
                </div>
            </div>
        )
    }
    else {
        return (<p>Loading...</p>);
    }
}

function HashtagFilteredPosts({ user, lang }) {

    const history = useHistory();
    const { hashtag } = useParams();
    if (checkUser(user) === false)
        history.replace('/login');

    if (user.length === 0)
        return '';
    else {
        return (
            <div className={`container-fluid ${classes.peopletab}`}>
                <Navbar />
                <div className={classes.main}>
                    <Sidebar1 user={user} lang={lang} />
                    <div className={classes.posts}>
                        <h5 className="hashtagHeading">{"#" + hashtag}</h5>
                        <Posts userId={user.uid} hashtag={hashtag} />
                    </div>
                    <Sidebar2 user={user} lang={lang} />
                </div>
            </div>
        );
    }
}

export default HashtagFilteredPosts;