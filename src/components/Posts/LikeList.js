import React, { useEffect, useState } from 'react';
import classes from './styles/likelist.module.css';
import { db } from '../config/firebase';
import { useHistory } from 'react-router';
import { Avatar } from "@material-ui/core";
import { time_ago } from '../Utilities/timeFunction';

function LikeList(props) {

    const history = useHistory();
    const [list, setList] = useState([]);
    const [message, setMessage] = useState('');
    const [showMoreLikes, setShowMoreLikes] = useState(false);
    const [update, setUpdate] = useState(false);
    console.log(props.clips);
    const collection = props.clips ? "Clips" : "Feeds";

    let queryRef = null;
    if(props.for === 'post')
        queryRef = db.collection(collection).doc(props.postid).collection("flameL");
    else if(props.for === 'comment')
        queryRef = db.collection(collection).doc(props.postid).collection("commentL").doc(props.comid).collection("flameL");
    else if(props.for === 'reply')
        queryRef = db.collection(collection).doc(props.postid).collection("commentL").doc(props.comid).collection("commentL").doc(props.replyid).collection("flameL");

    useEffect(() => {
        
        queryRef.orderBy('ts', 'desc').limit(10).get()
            .then((snap) => {
                //console.log(snap);
                if (snap.empty) {
                    setMessage("No likes");
                }
                else {
                    setList(snap.docs.map((doc) => {
                        return ({
                            id: doc.id,
                            data: doc.data()
                        });
                    }));
                    setShowMoreLikes(true);
                    setUpdate(false);
                }
            });
        
    }, [props.postid]);

    useEffect(() => {
        //console.log("UseEffect Update");
        function updateList() {
            setShowMoreLikes(false);
            setMessage('Loading...');
            const last = list[list.length - 1];

            queryRef.orderBy('ts', 'desc').startAfter(last.data.ts).limit(10).get()
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
                        setShowMoreLikes(true);
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

    const element = document.getElementById('showMoreLikes');
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
                <small>{time_ago(cvalue.data.ts)}</small>
            </div>
        );
    }

    return (
        <div className={classes.list}>
            {list.map(Row)}
            <div>
                {showMoreLikes && <div id='showMoreLikes'></div>}
                {message !== '' ? <p className="text-center mt-1 mb-0">{message}</p> : ''}
            </div>
        </div>
    );

}

export default LikeList;