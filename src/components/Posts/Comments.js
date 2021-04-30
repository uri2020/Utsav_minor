import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../config/firebase.js';
import firebase from "firebase";
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import { Avatar, Modal } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Replies from './Replies';
import LikeList from './LikeList';
import likeListClasses from './styles/likelist.module.css';

//Its for animated alerts, it requires "npm i sweetalert"
import swal from 'sweetalert';

const confirmDeleteComment = async () => {

    const r = await swal({
        title: "Warning",
        text: "Are you sure that you want to Delete this Comment?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

    return r;
}

const confirmReportComment = async () => {

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


function Comment({ comment, postId, origuid, origusertype, origusername, origuserdp, clips }) {

    const history = useHistory('');
    const menuRef = useRef();
    const menubtnRef = useRef();
    const [commentLiked, setCommentLiked] = useState('');
    const [likecount, setLikecount] = useState(comment.data.likecount);
    const [reply, setReply] = useState('');
    const [replies, setReplies] = useState([]);
    const [editComment, setEditComment] = useState(false);
    const [updateCommenttxt, setUpdateCommenttxt] = useState(comment.data.comment);
    const viewOnly = origuid === undefined ? true : false;
    const collection = clips ? 'Clips' : 'Feeds';
    const [openMoreOptions, setOpenMoreOptions] = useState(false);
    const [showLikeList, setShowLikeList] = useState(false);


    useEffect(() => {

        db.collection("Feeds").doc(postId).collection("commentL").doc(comment.id).collection("flameL").doc(origuid).get()
            .then((doc) => {
                if (doc.exists) {
                    setCommentLiked("blue");
                }
            });

    }, [postId, comment.id, origuid]);

    useEffect(() => {
        db.collection(collection).doc(postId).collection("commentL").doc(comment.id).collection("commentL").orderBy("ts", "desc").onSnapshot((snapshot) => {
            setReplies(snapshot.docs.map((doc) => {
                return ({
                    id: doc.id,
                    data: doc.data(),
                });
            }));
        });
    }, [comment.id, postId, collection]);

    useEffect(() => {

        document.addEventListener("mousedown", (event) => {
            if ((menuRef.current !== undefined && menuRef.current !== null) && (menubtnRef.current !== undefined && menubtnRef.current !== null)) {
                if (!menuRef.current.contains(event.target) && !menubtnRef.current.contains(event.target)) {
                    setOpenMoreOptions(false);
                }
            }
        });
    });


    const postReply = (event) => {
        event.preventDefault();

        const batch = db.batch();

        const reply_ref = db.collection(collection).doc(postId).collection("commentL").doc(comment.id)
            .collection("commentL").doc();
        const comment_ref = db.collection(collection).doc(postId).collection("commentL").doc(comment.id);

        batch.set(reply_ref, {
            comment: reply,
            uid: origuid,
            username: origusername,
            userdp: origuserdp,
            type: origusertype,
            ts: Date.now(),
            postID: postId,
            comID: comment.id,
            likecount: 0,
            reportcount: 0
        })

        batch.update(comment_ref, { cmtNo: firebase.firestore.FieldValue.increment(1) });

        batch.commit();

        setReply('');
    }


    function commentLikeHandle() {
        const comid = comment.id;
        const batch = db.batch();
        const com_ref = db.collection(collection).doc(postId).collection("commentL").doc(comid);

        if (commentLiked === '') {
            setCommentLiked("blue");
            setLikecount(likecount + 1);
            const flameL_ref = db.collection(collection).doc(postId).collection("commentL").doc(comid).collection("flameL").doc(origuid);
            batch.set(flameL_ref, {
                comID: comid,
                ts: Date.now(),
                username: origusername,
                userdp: origuserdp,
                type: origusertype,
                uid: origuid
            });

            batch.update(com_ref, {
                likecount: firebase.firestore.FieldValue.increment(1)
            });
            batch.commit();
        }
        else if (commentLiked === "blue") {
            setCommentLiked("");
            setLikecount(likecount - 1);

            const like_ref = db.collection(collection).doc(postId).collection("commentL").doc(comid).collection("flameL")
                .doc(origuid);

            batch.delete(like_ref);

            batch.update(com_ref, {
                likecount: firebase.firestore.FieldValue.increment(-1)
            });
            batch.commit();
        }
    }

    const handleToggle = () => {
        setOpenMoreOptions(!openMoreOptions);
    };

    async function reportComment() {
        const comid = comment.id;
        if (await confirmReportComment()) {

            const batch = db.batch();
            const com_ref = db.collection(collection).doc(postId).collection("commentL").doc(comid);
            const report_data = await com_ref.collection("reportL").doc(origuid).get();

            if (report_data.exists) {
                swal("Reported!", "You have already reported this comment!", "success");
            }
            else {
                const report_ref = com_ref.collection("reportL").doc(origuid)
                batch.set(report_ref, {
                    comID: comid,
                    ts: Date.now(),
                    username: origusername,
                    userdp: origuserdp,
                    type: origusertype,
                    uid: origuid
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

    async function deleteComment() {
        const comid = comment.id;
        if (await confirmDeleteComment()) {

            const batch = db.batch();

            const post_ref = db.collection(collection).doc(postId);
            const comment_ref = db.collection(collection).doc(postId).collection("commentL").doc(comid);

            batch.delete(comment_ref);
            batch.update(post_ref, { cmtNo: firebase.firestore.FieldValue.increment(-1) });

            batch.commit();

            swal("Deleted!", "Your comment has been deleted!", "success");
        }
    }

    const CommentMoreOptions = (props) => {

        if (props.uid === origuid) {
            return (
                <div ref={menuRef} className="commentMoreOptions" >
                    <p onClick={showEditComment}>Edit comment</p>
                    <p onClick={deleteComment}>Delete comment</p>
                </div>
            );
        }
        else {
            return (
                <div ref={menuRef} className="commentMoreOptions" onClick={reportComment}>
                    <p>Report Comment</p>
                </div>
            );
        }
    }

    function showWriteReply() {
        const el = document.getElementById(`${comment.id}writeReply`);
        const display = el.style.display;

        if (display === 'none' || display === '') {
            el.style.display = 'block';
        }
        else {
            el.style.display = 'none';
        }
    }

    function showViewReplies(e) {
        e.preventDefault();
        const el = document.getElementById(`${comment.id}replies`);
        const display = el.style.display;

        if (display === 'none' || display === '') {
            el.style.display = 'block';
            e.currentTarget.innerHTML = "Hide Replies ";
        }
        else {
            el.style.display = 'none';
            e.currentTarget.innerHTML = "View Replies ";
        }
    }
    function showEditComment() {
        setUpdateCommenttxt(comment.data.comment);
        setEditComment(true);
    }

    function viewProfile() {
        if (!viewOnly)
            history.push("/profile/" + comment.data.uid);
    }

    function openLikeListModal(){
        if(likecount > 0)
            setShowLikeList(true);
    }

    async function updateComment() {
        if (updateCommenttxt !== '' && updateCommenttxt !== comment.data.comment) {
            const com_ref = db.collection(collection).doc(postId).collection("commentL").doc(comment.id);
            await com_ref.update({ comment: updateCommenttxt });
            swal("Updated!", "Your comment has been updated!", "success");
        }
        setEditComment(false);
    }

    if (editComment) {
        return (
            <div className="editComment">
                <Avatar
                    className="commentAvatar"
                    alt={origusername}
                    src={origuserdp}
                />
                <div className="editCommentBox">
                    <textarea className="updatecommentInputBox" value={updateCommenttxt}
                        onChange={(e) => setUpdateCommenttxt(e.target.value)}></textarea>
                    <button className="btn btn-outline-success" onClick={updateComment}>Update</button>
                    <button className="btn btn-outline-danger" onClick={() => setEditComment(false)}>Cancel</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <>
                <div className="commentL__show">
                    <Avatar
                        className="post__avatar2"
                        alt={comment.data.username}
                        src={comment.data.userdp}
                        onClick={viewProfile}
                    />
                    <div className="container__commentL">
                        <div style={{backgroundColor:"rgba(0,0,0,0.08)", borderRadius:"15px",paddingLeft:"15px"}}>
                        <p style={{margin:"0"}}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }} onClick={viewProfile}>{comment.data.username}</span>
                            <br />
                            <span>{comment.data.comment}</span>
                        </p>
                        <small style={{ fontSize: '10px' }}>{time_ago(comment.data.ts)}</small></div>
                        <div className="commentBtns">
                            {viewOnly ?
                                <ThumbUpAltIcon className="blue" fontSize="small" style={{ marginTop: '-4px' }} />
                                :
                                <ThumbUpAltIcon className={commentLiked} fontSize="small" onClick={commentLikeHandle} style={{ marginTop: '-4px' }} />
                            }
                            <span style={{ margin: '0 8px', color: 'purple' }} onClick={openLikeListModal}>{likecount}</span>
                            {viewOnly ? null :
                                <span style={{ fontSize: '12px' }} onClick={showWriteReply} ><ReplyIcon className="replyIcon" /> Reply</span>
                            }
                            {comment.data.cmtNo > 0 ?
                                <>
                                    <a className="viewReplies" onClick={showViewReplies} href={"#" + comment.id + "replies"} >View replies </a>
                                    <span style={{ fontSize: 'small' }}>{comment.data.cmtNo}</span>
                                </>
                                : ''
                            }
                        </div>
                        
                        {viewOnly ? null :
                            <>
                                <IconButton
                                    className="dots"
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                    ref={menubtnRef}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                {openMoreOptions && <CommentMoreOptions comid={comment.id} uid={comment.data.uid} />}
                            </>
                        }
                    </div>
                </div>
                {viewOnly ? null :
                    <div className="writeReply" id={`${comment.id}writeReply`}>
                        <form onSubmit={postReply}>
                            <div className="commentBox">
                                <Avatar
                                    className="post__avatar2"
                                    alt={origusername}
                                    src={origuserdp}
                                />
                                <input className="commentInputBox" type="text" placeholder="Write a reply ... " value={reply} onChange={(e) => setReply(e.target.value)} />
                                <input type="submit" disabled={!reply} className="transparent__submit" />
                            </div>
                            <p className="pressEnterToPost">Press Enter to post reply</p>
                        </form>
                    </div>
                }
                <div className="replies" id={`${comment.id}replies`}>
                    {replies.map((cvalue) =>
                        <Replies
                            key={cvalue.id}
                            id={cvalue.id}
                            data={cvalue.data}
                            origuid={origuid}
                            origusertype={origusertype}
                            origusername={origusername}
                            origuserdp={origuserdp}
                            postid={postId}
                            clips={clips}
                        />
                    )}
                </div>
                <Modal open={showLikeList}>
                    <div className={likeListClasses.main}>
                        <div>
                            <div className={likeListClasses.heading}>
                                <h6>Who liked the Comment ?</h6>
                                <CancelIcon className={likeListClasses.closeBtn} onClick={()=> setShowLikeList(false)} />
                            </div>
                            <LikeList for="comment" postid={postId} comid={comment.id} clips={clips} />
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

}

export default Comment;
export { time_ago };
