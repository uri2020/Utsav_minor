import React, { useState, useEffect } from 'react';
import { db } from "../config/firebase.js";
import classes from './styles/upvoteFollowList.module.css';
import { Avatar } from "@material-ui/core";
import { useHistory } from 'react-router';

function UpvoteFollowList(props) {

    const history = useHistory();
    const [list, setList] = useState([]);
    const [message, setMessage] = useState('');
    const [showMoreUsers, setShowMoreUsers] = useState(false);
    const [update, setUpdate] = useState(false);

    let query_ref = null;
    if (props.for === 'upvote')
        query_ref = db.collection("Users").doc(props.userid).collection("Upvoters");
    else if (props.for === 'follow')
        query_ref = db.collection("Users").doc(props.userid).collection("Followers");

    useEffect(() => {

        query_ref.orderBy('ts', 'desc').limit(10).get()
            .then((snap) => {
                //console.log(snap);
                if (snap.empty) {
                    setMessage("No results");
                }
                else {
                    setList(snap.docs.map((doc) => {
                        return ({
                            id: doc.id,
                            data: doc.data()
                        });
                    }));
                    setUpdate(false);
                    setShowMoreUsers(true);
                }
            });

    }, []);

    useEffect(() => {
        //console.log("UseEffect Update");
        function updateList() {
            setShowMoreUsers(false);
            setMessage('Loading...');
            const last = list[list.length - 1];

            query_ref.orderBy('ts', 'desc').startAfter(last.data.ts).limit(10).get()
                .then((snap) => {
                    const array = snap.docs.map((doc) => {
                        return ({
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                    if (array.length === 0)
                        setMessage('');
                    else {
                        setList([...list, ...array]);
                        setMessage('');
                        setShowMoreUsers(true);
                    }
                });
            setUpdate(false);
        }

        if (update)
            updateList();

    }, [update]);


    function showMore(entries) {

        if (entries[0] && entries[0].isIntersecting) {

            if (list[0])
                setUpdate(true);
        }
    }

    let options = {
        rootMargin: '0px',
        threshold: 0.2
    }

    const element = document.getElementById('showMoreUsers');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    function viewProfile(id) {
        history.push("/profile/" + id);
    }

    function Row(cvalue) {

        return (
            <div key={cvalue.id} className={classes.row} onClick={() => viewProfile(cvalue.data.uid)}>
                <Avatar src={cvalue.data.userdp} alt={cvalue.username} />
                <p>{cvalue.data.username}</p>
            </div>
        );
    }

    return (
        <div className={classes.list}>
            {list.map(Row)}
            <div>
                {showMoreUsers && <div id='showMoreUsers'></div>}
                {message !== '' ? <p className="text-center mt-1 mb-0">{message}</p> : ''}
            </div>
        </div>
    );

}

export default UpvoteFollowList;