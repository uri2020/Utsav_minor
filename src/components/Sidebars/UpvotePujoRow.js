import React, { useState, useEffect } from 'react';
import { db } from "../config/firebase.js";
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';
import Switch from "react-switch";
import Avatar from '@material-ui/core/Avatar';


const upvotePujo = (id, uid, AddorRemove) => {
    const batch = db.batch();
    const communittee_ref = db.collection('Users').doc(id);
    
    const username = localStorage.getItem('Username');
    const dp = localStorage.getItem('Dp');
    const type = localStorage.getItem('type');

    if ( AddorRemove === 'add') {
        const upvoters_ref = db.collection("Users").doc(id).collection("Upvoters").doc(uid);
        batch.update(communittee_ref, { upvotes: firebase.firestore.FieldValue.increment(1) });
        
        batch.set(upvoters_ref, {
            ts: Date.now(),
            type: type,
            uid: uid,
            username: username,
            userdp: dp
        });
    }
    else if ( AddorRemove === 'remove') {

        batch.update(communittee_ref, { upvotes: firebase.firestore.FieldValue.increment(-1) });

        const upvoters_ref = db.collection("Users").doc(id).collection("Upvoters").doc(uid);
        batch.delete(upvoters_ref);
    }

    batch.commit();
}

const UpvotePujoRow = (props) => {
    
    const [upvote_check, set_upvote_check] = useState(false);
    const history = useHistory('');

    useEffect(() => {

        if (props.id) {
            db.collection('Users').doc(props.id).collection("Upvoters").doc(props.uid).get()
                .then((doc) => {
                    if (doc.exists)
                        set_upvote_check(true);
                })
        }

    }, [props.id, props.uid]);

    function handleChange() {
        if (upvote_check) {
            upvotePujo(props.id, props.uid, 'remove');
        }
        else {
            upvotePujo(props.id, props.uid, 'add');
        }
        set_upvote_check(!upvote_check);

    }

    function onClickHandler() {
        history.push("/profile/" + props.id);
    }

    return (
        <>
            <li className="upvote-pujo-list-item">
                <Avatar alt={props.user} src={props.imgsrc} className="itemDp" onClick={onClickHandler} />
                <p onClick={onClickHandler}>
                    {props.name}
                </p>
                <div className="switch-toggle">
                    <Switch
                        onChange={handleChange}
                        checked={upvote_check} uncheckedIcon={false}
                        onColor="#800080"
                    />
                </div>
            </li>
            <hr style={{ margin: 0 }} />
        </>
    );
}

export default UpvotePujoRow;
export { upvotePujo };