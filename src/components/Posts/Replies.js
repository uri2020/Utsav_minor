import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from "../config/firebase.js";
import firebase from "firebase";
import { Avatar, Modal } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CancelIcon from '@material-ui/icons/Cancel';
import LikeList from './LikeList';
import likeListClasses from './styles/likelist.module.css';
import classes from "./styles/replies.module.css";
import swal from 'sweetalert';

const confirmDeleteReply = async () => {

    const r = await swal({
        title: "Warning",
        text: "Are you sure that you want to Delete this Comment?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

    return r;
}

const confirmReportReply = async () => {

    const r = await swal({
        title: "Warning",
        text: "Are you sure that you want to Report this Comment?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

    return r;
}



function time_ago(ts) {
    const time_now = new Date().getTime();
    let time = time_now - ts;
    if (time <= 86400000) {
        if (time <= 60000) {
            time = time / 6000;
            time = Math.round(time);
            if (time === 1)
                return `${time} second ago`;
            else
                return `${time} seconds ago`;
        }
        if (time <= 3600000) {
            time = time / 60000;
            time = Math.round(time);
            if (time === 1)
                return `${time} minute ago`;
            else
                return `${time} minutes ago`;
        }
        if (time <= 86400000) {
            time = time / 3600000;
            time = Math.round(time);
            if (time === 1)
                return `${time} hour ago`;
            else
                return `${time} hours ago`;
        }
    }
    else {
        if (time <= 2592000000) {
            time = time / 86400000;
            time = Math.round(time);
            if (time === 1)
                return `${time} day ago`;
            else
                return `${time} days ago`;
        }
        else {
            const t = new Date(ts);
            time = t.toDateString();
            return time;
        }
    }
}

function Replies(props) {

    const history = useHistory('');
    const menuRef = useRef();
    const menubtnRef = useRef();
    const [replyLiked, setReplyLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(props.data.likecount);
    const [editReply, setEditReply] = useState(false);
    const [updateReplytxt, setUpdateReplytxt] = useState(props.data.comment);
    const viewOnly = props.origuid === undefined ? true : false;
    const collection = props.clips ? 'Clips' : 'Feeds';
    const [openMoreOptions, setOpenMoreOptions] = useState(false);
    const [showLikeList, setShowLikeList] = useState(false);

    useEffect(() => {

        const postId = props.data.postID;
        const comId = props.data.comID;
        db.collection("Feeds").doc(postId).collection("commentL").doc(comId).collection("commentL").doc(props.id)
            .collection("flameL").doc(props.origuid).get()
            .then((doc) => {
                if (doc.exists) {
                    setReplyLiked(true);
                }
            });

    }, [props.data.postID, props.data.comID, props.id, props.origuid]);

    useEffect(() => {

        document.addEventListener("mousedown", (event) => {
            if ((menuRef.current !== undefined && menuRef.current !== null) && (menubtnRef.current !== undefined && menubtnRef.current !== null)) {
                if (!menuRef.current.contains(event.target) && !menubtnRef.current.contains(event.target)) {
                    setOpenMoreOptions(false);
                }
            }
        });
    });


    function replyLikeHandle() {
        const postId = props.data.postID;
        const comId = props.data.comID;
        const batch = db.batch();
        const com_ref = db.collection(collection).doc(postId).collection("commentL").doc(comId).collection("commentL").doc(props.id);

        if (replyLiked) {
            setReplyLiked(false);
            setLikeCount(likeCount - 1);

            const like_ref = db.collection(collection).doc(postId).collection("commentL").doc(comId)
                .collection("commentL").doc(props.id).collection("flameL")
                .doc(props.origuid);

            batch.delete(like_ref);
            batch.update(com_ref, {
                likecount: firebase.firestore.FieldValue.increment(-1)
            });
            batch.commit();
        }
        else {
            setReplyLiked(true);
            setLikeCount(likeCount + 1);

            const flameL_ref = db.collection(collection).doc(postId).collection("commentL").doc(comId)
                .collection("commentL").doc(props.id).collection("flameL").doc(props.origuid);

            batch.set(flameL_ref, {
                comID: props.id,
                ts: Date.now(),
                uid: props.origuid,
                type: props.origusertype,
                username: props.origusername,
                userdp: props.origuserdp
            });
            batch.update(com_ref, {
                likecount: firebase.firestore.FieldValue.increment(1)
            });
            batch.commit();
        }
    }

    async function reportReply() {
        const comid = props.data.comID;
        if (await confirmReportReply()) {

            const batch = db.batch();
            const com_ref = db.collection(collection).doc(props.postid).collection("commentL").doc(comid)
                .collection("commentL").doc(props.id);
            const report_data = await com_ref.collection("reportL").doc(props.origuid).get();

            if (report_data.exists) {
                swal("Reported!", "You have already reported this comment!", "success");
            }
            else {
                const report_ref = com_ref.collection("reportL").doc(props.origuid)
                batch.set(report_ref, {
                    comID: props.id,
                    ts: Date.now(),
                    uid: props.origuid,
                    type: props.origusertype,
                    username: props.origusername,
                    userdp: props.origuserdp
                })

                batch.update(com_ref, {
                    reportcount: firebase.firestore.FieldValue.increment(1)
                });

                batch.commit()
                    .then(() => {
                        swal("Reported!", "The comment has been reported!", "success");
                    });
            }
        }
    }

    async function deleteReply() {
        const comid = props.data.comID;
        if (await confirmDeleteReply()) {

            const batch = db.batch();

            const com_ref = db.collection(collection).doc(props.postid).collection("commentL").doc(comid);
            const reply_ref = com_ref.collection("commentL").doc(props.id);

            batch.delete(reply_ref);
            batch.update(com_ref, { cmtNo: firebase.firestore.FieldValue.increment(-1) });

            batch.commit();

            swal("Deleted!", "Your comment has been deleted!", "success");
        }
    }

    function showEditReply() {
        setUpdateReplytxt(props.data.comment);
        setEditReply(true);
    }

    const MoreOptions = () => {

        if (props.data.uid === props.origuid) {
            return (
                <div ref={menuRef} className={classes.repliesMoreOptions} id={props.id + "Options"}>
                    <p onClick={showEditReply}>Edit Reply</p>
                    <p onClick={deleteReply}>Delete reply</p>
                </div>
            );
        }
        else {
            return (
                <div ref={menuRef} className={classes.repliesMoreOptions} id={props.id + "Options"}>
                    <p onClick={reportReply}>Report reply</p>
                </div>
            );
        }
    }

    function handleToggle() {
        setOpenMoreOptions(!openMoreOptions);
    }

    function openLikeListModal() {
        if (likeCount > 0)
            setShowLikeList(true);
    }

    function viewProfile() {
        if (!viewOnly)
            history.push("/profile/" + props.data.uid);
    }

    async function updateReply() {
        if (updateReplytxt !== '' && updateReplytxt !== props.data.comment) {
            const com_ref = db.collection(collection).doc(props.postid).collection("commentL").doc(props.data.comID)
                .collection("commentL").doc(props.id);
            await com_ref.update({ comment: updateReplytxt });
            swal("Updated!", "Your comment has been updated!", "success");
        }
        setEditReply(false);
    }

    if (editReply) {
        return (
            <div className="editComment">
                <Avatar
                    className={classes.avatar}
                    alt={props.data.username}
                    src={props.data.userdp}
                />
                <div className="editCommentBox">
                    <textarea className="updatecommentInputBox" value={updateReplytxt}
                        onChange={(e) => setUpdateReplytxt(e.target.value)}></textarea>
                    <button className="btn btn-outline-success" onClick={updateReply}>Update</button>
                    <button className="btn btn-outline-danger" onClick={() => setEditReply(false)}>Cancel</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={classes.replyContainer}>
                <Avatar
                    className={classes.avatar}
                    alt={props.data.username}
                    src={props.data.userdp}
                    onClick={viewProfile}
                />
                <p>
                    <div style={{backgroundColor:"rgba(0,0,0,0.08)",borderRadius:"15px",paddingLeft:"15px"}}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }} onClick={viewProfile}>{props.data.username}</span>
                    <br />
                    <span>{props.data.comment}</span>
                    <br />
                    <small style={{ fontSize: '10px' }}>{time_ago(props.data.ts)}</small></div>
                    <div style={{paddingLeft:"15px"}}>
                    {viewOnly ?
                        <span className={classes.replyLike}>
                            <ThumbUpAltIcon className="blue" fontSize="small" style={{ marginTop: '-4px' }} />
                            {"  " + likeCount}
                        </span>
                        :
                        <>
                            <span className={classes.replyLike}>
                                <ThumbUpAltIcon className={replyLiked ? "blue" : ''} fontSize="small" onClick={replyLikeHandle} style={{ marginTop: '-4px' }} />
                            </span>
                            <span className={classes.replyLikeCount} onClick={openLikeListModal}>{likeCount}</span>
                        </>
                    }</div>
                    
                </p>
                {viewOnly ? null :
                    <>
                        <IconButton
                            className={classes.more}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            ref={menubtnRef}
                            style={{ outline: 'none',borderRadius: "50%",position: "absolute",right: "-1px",top:"-10px",transform:"rotate(90deg)" }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        { openMoreOptions && <MoreOptions />}
                    </>
                }

                <Modal open={showLikeList}>
                    <div className={likeListClasses.main}>
                        <div>
                            <div className={likeListClasses.heading}>
                                <h6>Who liked the Reply ?</h6>
                                <CancelIcon className={likeListClasses.closeBtn} onClick={() => setShowLikeList(false)} />
                            </div>
                            <LikeList for="reply" postid={props.data.postID} comid={props.data.comID} replyid={props.id} clips={props.clips} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Replies;
