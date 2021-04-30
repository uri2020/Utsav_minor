import React, { useState, useEffect } from 'react'
import ImageUpload from './ImageUpload';
import './styles/Posts.css';
import { db } from "../config/firebase.js";
import Post from './Post.js';
import { useHistory } from 'react-router-dom';

function Feeds({ user, posttype, clips, lang }) {
    const history = useHistory("");
    const [Feeds, setFeeds] = useState([]);
    const uid = user.uid;
    const name = localStorage.getItem("Username");
    const dp = localStorage.getItem("Dp");
    const type = localStorage.getItem("type");
    const [message, setMessage] = useState('');
    const [showMorePost, setShowMorePost] = useState(true);
    //console.log(user)

    if (user === undefined) {
        history.push("/login")
    }
    // the max. post limit is 4. It need to be changed to 10.
    useEffect(() => {
        if (clips) {
            db.collection('Clips').orderBy('ts', 'desc').limit(4).onSnapshot(snapshot => {
                setFeeds(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                })));
                setShowMorePost(true);
            });
        }
        else {
            db.collection('Feeds').where('type', '==', posttype).orderBy('ts', 'desc').limit(4).onSnapshot(snapshot => {
                setFeeds(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                })));
                setShowMorePost(true);
            });
        }

    }, [posttype, clips], []);

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
        if (clips) {
            db.collection('Clips').orderBy('ts', 'desc').startAfter(last).limit(4).get()
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
        else {
            db.collection('Feeds').where('type', '==', posttype).orderBy('ts', 'desc').startAfter(last).limit(4).get()
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
    }


    if (Feeds[0] && name && dp) {
        return (
            <div className="Feeds">
                <ImageUpload usN={name} dp={dp} uid={uid} type={type} lang={lang}/>

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
                            clips={clips}
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

export default Feeds;