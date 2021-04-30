import React, { useState, useEffect } from 'react';
import { db } from "../config/firebase.js";
import Post from '../Posts/Post.js';

function ProfileClips({ userId, uid }) {

    const [Clips, setClips] = useState([]);
    const name = localStorage.getItem("Username");
    const dp = localStorage.getItem("Dp");
    const type =localStorage.getItem("type");
    const [Message, setMessage] = useState('');
    const [message, setmessage] = useState('');
    const [showMoreClips, setShowMoreClips] = useState(true);

    // the max. post limit is 4. It need to be changed to 10.
    useEffect(() => {
        db.collection('Clips').where('uid', '==', uid).orderBy('ts', 'desc').limit(4).onSnapshot(snapshot => {
            if (snapshot.docs.length === 0)
                setMessage("No Posts to show.");
            else {
                setClips(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                })));
                setShowMoreClips(true);
            }
        });

    }, [uid], []);

    function showMore(entries) {

        if (entries[0] && entries[0].isIntersecting) {

            if (Clips[0])
                updateClips();
        }
    }

    let options = {
        rootMargin: '0px',
        threshold: 0.5
    }

    const element = document.getElementById('showMoreClips');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    function updateClips() {
        const last = Clips[Clips.length - 1].post.ts;
        setShowMoreClips(false);
        setmessage("Loading...");
        db.collection('Clips').orderBy('ts', 'desc').startAfter(last).limit(4).get()
            .then((snapshot) => {
                const array = snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                }));
                if (array.length === 0) {
                    setmessage('No more posts to show.');
                }
                else {
                    setClips([...Clips, ...array]);
                    setmessage('');
                    setShowMoreClips(true);
                }
            });

    }


    if (Clips[0] && name && dp) {
        return (
            <div>

                {
                    Clips.map(({ id, post }) => (
                        <Post
                            key={id}
                            postId={id}
                            origuid={userId}
                            origusername={name}
                            origusertype={type}
                            origuserdp={dp}
                            userId={post.uid}
                            postusername={post.username}
                            postuserdp={post.userdp}
                            txt={post.txt}
                            img=""
                            video={post.video}
                            clips={true}
                            likecount={post.likecount}
                            commentcount={post.cmtNo}
                        />
                    ))
                }
                <div>
                    {showMoreClips && <div id='showMoreClips'>Loading...</div>}
                    {message !== '' ? <p>{message}</p> : ''}
                </div>
            </div>
        )
    }
    else {
        return (<p className="text-center">{Message}</p>);
    }
}

export default ProfileClips;