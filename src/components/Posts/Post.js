import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './styles/Post.css';
import classes from './styles/viewPost.module.css';
import likeListClasses from './styles/likelist.module.css';
import { Avatar, Modal } from '@material-ui/core';
import { db } from "../config/firebase.js";
import FavoriteIcon from '@material-ui/icons/ThumbUp';
import ChatIcon from '@material-ui/icons/Chat';
import ShareIcon from '@material-ui/icons/Share';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Carouselpost from './Carouselpost';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/Cancel';
import Comment from './Comments';
import LikeList from './LikeList';
import EditPost from "./Editpost";
import editpostClasses from './styles/editpost.module.css';
import firebase from "firebase";
import { time_ago } from "./Comments";
import ClearIcon from '@material-ui/icons/Clear';
import swal from 'sweetalert';
import { ThumbUp } from '@material-ui/icons';
import ReactHashtag from "react-hashtag";

function Post({ postId, origuid, origusertype, origusername, origuserdp, userId, postusername, postuserdp, txt, img, ts, video, clips, likecount, commentcount, viewSinglePost }) {

    const history = useHistory();
    const menuRef = useRef();
    const menubtnRef = useRef();
    const [comment, setComment] = useState('');
    const [show, setShow] = useState('not_liked');
    const [show2, setShow2] = useState('textforlike');
    const [commentL, setcommentL] = useState([]);
    const [likeCount, setLikeCount] = useState(likecount);
    const [showMoreComment, setShowMoreComment] = useState(true);
    const [message, setMessage] = useState('');
    const viewOnly = origuid === undefined ? true : false;
    const collection = clips ? 'Clips' : 'Feeds';
    const [openMoreOptions, setOpenMoreOptions] = useState(false);
    const [showLikeList, setShowLikeList] = useState(false);
    const [openEditPostModal, setOpenEditPostModal] = useState(false);
    const [openSinglePost, setOpenSinglePost] = useState(false);

    var sharemodal;
    if (viewSinglePost === true)
        sharemodal = document.getElementById("shareModal2");
    else
        sharemodal = document.getElementById("shareModal");

    function share() {
        sharemodal.style.display = "block";
    }

    function closeshare() {
        sharemodal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === sharemodal) {
            sharemodal.style.display = "none";
        }
    }

    useEffect(() => {
        let unsubscribe;
        const lim = viewSinglePost ? 8 : 2;
        if (postId) {

            unsubscribe = db.collection(collection).doc(postId).collection("commentL").orderBy("ts", "desc").limit(lim).onSnapshot((snapshot) => {
                setcommentL(snapshot.docs.map((doc) => {
                    return ({
                        id: doc.id,
                        data: doc.data(),
                    });
                }
                ));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId, collection, viewSinglePost]);

    useEffect(() => {

        db.collection("Feeds").doc(postId).collection("flameL").doc(origuid).get()
            .then((doc) => {
                if (doc.exists) {
                    setShow('red');
                    setShow2('blue');
                }
            });

    }, [postId, origuid]);

    useEffect(() => {

        document.addEventListener("mousedown", (event) => {
            if ((menuRef.current !== undefined && menuRef.current !== null) && (menubtnRef.current !== undefined && menubtnRef.current !== null)) {
                if (!menuRef.current.contains(event.target) && !menubtnRef.current.contains(event.target)) {
                    setOpenMoreOptions(false);
                }
            }
        });
    });

    function showMore(entries) {

        if (entries[0] && entries[0].isIntersecting) {

            if (commentL[0])
                updateComments();
        }
    }

    let options = {
        rootMargin: '0px',
        threshold: 0.5
    }

    const element = document.getElementById('showMoreComment');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    function updateComments() {
        const last = commentL[commentL.length - 1].data.ts;
        setShowMoreComment(false);
        setMessage("Loading...");
        db.collection(collection).doc(postId).collection("commentL").orderBy("ts", "desc").startAfter(last).limit(8).get()
            .then((snapshot) => {
                const array = snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                }));
                if (array.length === 0) {
                    setMessage('No more comments to show.')
                }
                else {
                    setcommentL([...commentL, ...array]);
                    setMessage('');
                    setShowMoreComment(true);
                }
            });
    }

    const confirmDelete = async () => {

        const r = await swal({
            title: "Warning",
            text: "Are you sure that you want to Delete this Post?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

        return r;
    }

    const confirmReport = async () => {

        const r = await swal({
            title: "Warning",
            text: "Are you sure that you want to Report this Post?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

        return r;
    }

    async function deletePost() {
        const postid = postId;
        if (await confirmDelete()) {

            const post_ref = db.collection(collection).doc(postid);
            post_ref.delete();

            swal("Deleted!", "Your Post has been deleted!", "success");
        }
    }

    async function reportPost() {
        const postid = postId;
        if (await confirmReport()) {

            const post_ref = db.collection(collection).doc(postid);
            const data = await post_ref.get();
            const report_data = data.data().reportL;

            if (report_data.includes(origuid)) {
                swal("Reported!", "You have already reported this Post!", "success");
            }
            else {
                post_ref.update({ reportL: firebase.firestore.FieldValue.arrayUnion(origuid) })
                    .then(() => {
                        swal("Reported!", "The Post has been reported!", "success");
                    });

            }
        }
    }

    function EditPostModal() {

        function close() {
            setOpenEditPostModal(false);
        }

        return (
            <Modal open={openEditPostModal}>
                <div className={editpostClasses.container}>
                    <EditPost postid={postId} clips={clips} images={img} txt={txt} video={video} closeModal={close} />
                </div>
            </Modal>
        );
    }

    function editpost() {
        setOpenEditPostModal(true);
        setOpenMoreOptions(false);
    }

    function PostMoreOptions(props) {

        if (props.uid === origuid) {
            return (
                <div ref={menuRef} className="postMoreOptions" >
                    <p onClick={editpost}>Edit</p>
                    <p onClick={deletePost}>Delete</p>
                    {viewSinglePost ? null :
                        <p onClick={viewPost}>View</p>
                    }
                </div>
            );
        }
        else {
            return (
                <div ref={menuRef} className="postMoreOptions" >
                    <p onClick={reportPost}>Report</p>
                    {viewSinglePost ? null :
                        <p onClick={viewPost}>View</p>
                    }
                </div>
            );
        }
    }


    const likeHandle = (event) => {
        event.preventDefault();
        if (show === 'not_liked') {
            setShow('red');
            setShow2('blue');
            setLikeCount(likeCount + 1);
            const batch = db.batch();

            const flameL_ref = db.collection(collection).doc(postId).collection("flameL").doc(origuid);

            batch.set(flameL_ref, {
                postID: postId,
                postUid: userId,
                ts: Date.now(),
                type: origusertype,
                uid: origuid,
                username: origusername,
                userdp: origuserdp
            })

            const post_ref = db.collection(collection).doc(postId);

            batch.update(post_ref, { likecount: firebase.firestore.FieldValue.increment(1) });

            batch.commit();
        }
        else {
            const batch = db.batch();
            const like_ref = db.collection(collection).doc(postId).collection('flameL').doc(origuid);
            const post_ref = db.collection(collection).doc(postId);

            batch.delete(like_ref);
            batch.update(post_ref, {
                likecount: firebase.firestore.FieldValue.increment(-1)
            });
            batch.commit();

            setLikeCount(likeCount - 1);
            setShow('not_liked');
            setShow2('textforlike');
        }
    }

    function openLikeListModal() {
        if (likeCount > 0)
            setShowLikeList(true);
    }

    function closeLikeList() {
        setShowLikeList(false);
    }

    const handleTogglePostOptions = () => {
        setOpenMoreOptions(!openMoreOptions);
    };

    function Comments(comment) {

        return (
            <Comment
                key={comment.id}
                comment={comment}
                postId={postId}
                origuid={origuid}
                origusertype={origusertype}
                origusername={origusername}
                origuserdp={origuserdp}
                clips={clips} />
        );
    }

    const postComment = (event) => {
        event.preventDefault();

        const batch = db.batch();
        const commentL_ref = db.collection(collection).doc(postId).collection("commentL").doc();
        const post_ref = db.collection(collection).doc(postId);

        batch.set(commentL_ref, {
            comment: comment,
            uid: origuid,
            username: origusername,
            userdp: origuserdp,
            type: origusertype,
            ts: Date.now(),
            postID: postId,
            likecount: 0,
            cmtNo: 0,
            reportcount: 0
        });

        batch.update(post_ref, { cmtNo: firebase.firestore.FieldValue.increment(1) });

        batch.commit();

        setComment('');
    }

    const viewHashtagPost = (value) => {
        console.log(value);
        history.push("/hashtag/"+value.substring(1));
    }

    function applyHighlights(text) {

        text = text
            .replace(/#\w+/g, `<a class="tags" href="/hashtag/$&">$&</a>`);

        return text;
    }

    //const Hashtag = styled.span`color: "#4080FF";`;

    function viewPost() {
        setOpenMoreOptions(false);
        setOpenSinglePost(true);
    }

    function viewProfile() {
        if (!viewOnly)
            history.push("/profile/" + userId);
    }

    function SinglePostView() {
        return (
            <Modal open={openSinglePost} >
                <div className={classes.singlepostContainer} style={{ outline: "none" }} >
                    <div className={"container " + classes.singlepost} >
                        {viewOnly ? null :
                            <span onClick={() => setOpenSinglePost(false)} className={classes.back_btn}>
                                <ClearIcon />
                            </span>
                        }
                        <div className="row" style={{ height: "100%" }} >
                            <div className={classes.postLeft} style={{ border: "none" }}>
                                {clips ? <Carouselpost img='' video={video} postId={postId} openPost={viewPost} /> :
                                    <Carouselpost img={img} video='' postId={postId} full={true} openPost={viewPost} />}
                            </div>
                            <div className={classes.postRight}>
                                <div className="post__header post_name_modal">
                                    <Avatar
                                        className="post__avatar"
                                        alt={postusername}
                                        src={postuserdp}
                                        onClick={viewProfile}
                                    />
                                    <h3 onClick={viewProfile}>{postusername}</h3>
                                </div>

                                {txt === "" ? '' :
                                    <>
                                        <h4 className={classes.postText + " post_Text_caption"} dangerouslySetInnerHTML={{ __html: applyHighlights(txt) }}></h4>
                                    </>
                                }
                                <div className="post_Options_Container">
                                    <div className={classes.postOptions}>

                                        {viewOnly ?
                                            <>
                                                <div>
                                                    <span className="blue font-weight-bold" >{likeCount + " Like"}</span>
                                                </div>
                                            </> :
                                            <div>
                                                <ThumbUp className={show2} onClick={likeHandle} />
                                                <h3 className={show2} onClick={openLikeListModal} >
                                                    <span style={{ fontSize: "small" }} >{likeCount + (likeCount === 1 ? " Like" : " Likes")}</span>
                                                </h3>
                                            </div>
                                        }
                                        <div>
                                            <ChatIcon style={{ color: 'purple', marginRight: '3px' }} />
                                            <h3>{commentcount ? (commentcount) + " " : ""} Comment</h3>
                                        </div>
                                        <div className={classes.share}>
                                            <ShareIcon onClick={share} />
                                            {/* <button  style={{ border: "none", outline: "none", background: "inherit" }}>Share</button> */}
                                        </div>
                                        <div id="shareModal2" className="share-modal" style={{ display: 'none' }}>
                                            <div className="share-modal-content">
                                                <span id="closeshare" onClick={closeshare}>&times;</span>
                                                <div id="share-container">
                                                    <div className="share-via">
                                                        <button className="share-via-button" >
                                                            <WhatsAppIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <small style={{ marginLeft: '10px', color: 'gray' }}>{time_ago(ts)}</small></div>
                                <div className={classes.comments}>
                                    {commentL.map(Comments)}
                                    {showMoreComment && <p id="showMoreComment"></p>}
                                    {message !== '' ? <p className="text-center"><small>{message}</small></p> : ''}
                                </div>
                                {viewOnly ? null :
                                    <div className={classes.writeComment + " comment_box_modal"}>
                                        <form onSubmit={postComment}>
                                            <div className="commentBox">
                                                <input className="commentInputBox commentBox_modal" type="text" placeholder=" Add a comment ...  "
                                                    value={comment} onChange={(e) => setComment(e.target.value)} />
                                                <a href="" className={classes.anchor_Post}>Post</a>
                                                <input type="submit" disabled={!comment} className="transparent__submit" />
                                            </div>
                                        </form>
                                    </div>
                                }


                            </div>
                        </div>
                        <Modal open={showLikeList}>
                            <div className={likeListClasses.main}>
                                <div>
                                    <div className={likeListClasses.heading}>
                                        <h6>Who liked the post ?</h6>
                                        <CancelIcon className={likeListClasses.closeBtn} onClick={closeLikeList} />
                                    </div>
                                    <LikeList for="post" postid={postId} clips={clips} />
                                </div>
                            </div>
                        </Modal>
                        <EditPostModal />
                    </div>
                </div>
            </Modal>
        )
    }

    if (viewSinglePost === undefined || viewSinglePost === false) {

        return (
            <div className="post">
                <div className="post__header">

                    <Avatar
                        className="post__avatar"
                        alt={postusername}
                        src={postuserdp}
                        onClick={viewProfile}
                    />
                    <h3 onClick={viewProfile}>{postusername}</h3>
                    <div className="post_more_options">
                        <MoreHorizIcon ref={menubtnRef} onClick={handleTogglePostOptions} />
                        {openMoreOptions && <PostMoreOptions uid={userId} postid={postId} />}
                    </div>
                </div>


                { clips ? <Carouselpost img='' video={video} postId={postId} full={false} openPost={viewPost} /> :
                    <Carouselpost img={img} video='' postId={postId} full={false} openPost={viewPost} />}
                {txt === "" ? '' :
                    <h4 className="post__text">
                        <ReactHashtag renderHashtag={(hashtagValue) => (
                            <span className="hashtag" onClick={() => viewHashtagPost(hashtagValue)}>{hashtagValue}</span>
                        )} >
                            {txt}
                        </ReactHashtag>
                    </h4>
                }

                {(likeCount === 0 && commentcount <= 2) ? '' : <span />}
                <div className="post__options">
                    <div className="like">
                        <FavoriteIcon className={show} fontSize="small" onClick={likeHandle} />
                        <p style={{ margin: '0 10px', fontWeight: 'bold' }} onClick={openLikeListModal}>
                            {likeCount}
                        </p>
                    </div>
                    <div className="comment">
                        <ChatIcon fontSize="small" />
                        <h3 style={{ margin: '0 5px', fontWeight: 'bold' }}> {commentcount} </h3>
                    </div>
                    <div className="share">
                        <ShareIcon fontSize="small" onClick={share} />
                        {/* <button onClick={share} style={{ border: "none", outline: "none", background: "inherit" }}>Share</button> */}
                    </div>

                </div>
                <div id="shareModal" className="share-modal">
                    <div className="share-modal-content">
                        <span id="closeshare" onClick={closeshare}>&times;</span>
                        <div id="share-container">
                            <div className="share-via">
                                <button className="share-via-button" >
                                    <WhatsAppIcon />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={postComment} id="post_form">
                    <div className="commentBox">
                        <Avatar
                            className="post__avatar2"
                            alt={origusername}
                            src={origuserdp}
                        />
                        <input className="commentInputBox" type="text" placeholder="Write a comment ... "
                            value={comment} onChange={(e) => setComment(e.target.value)} />
                        <input type="submit" disabled={!comment} className="transparent__submit" />
                    </div>
                </form>

                {commentL.map(Comments)}
                <Modal open={showLikeList}>
                    <div className={likeListClasses.main}>
                        <div>
                            <div className={likeListClasses.heading}>
                                <h6>Who liked the post ?</h6>
                                <CancelIcon className={likeListClasses.closeBtn} onClick={closeLikeList} />
                            </div>
                            <LikeList for="post" postid={postId} clips={clips} />
                        </div>
                    </div>
                </Modal>
                <EditPostModal />
                <SinglePostView />
            </div>
        );
    }
    else if (viewSinglePost === true) {

        return (
            <>
                <div className={"container " + classes.post}>
                    {viewOnly ? null :
                        <span onClick={() => window.history.back()} className="back-btn">
                            <ArrowBackIcon />
                        </span>
                    }
                    <div className="row">
                        <div className="col-lg-6">
                            {clips ? <Carouselpost img='' video={video} postId={postId} /> :
                                <Carouselpost img={img} video='' postId={postId} full={true} />}
                        </div>
                        <div className={"col-lg-6 " + classes.postRight}>
                            <div className="post__header">
                                <Avatar
                                    className="post__avatar"
                                    alt={postusername}
                                    src={postuserdp}
                                    onClick={viewProfile}
                                />
                                <h3 onClick={viewProfile}>{postusername}</h3>
                                {viewOnly ? null :
                                    <div className="post_more_options">
                                        <MoreHorizIcon fontSize="large" ref={menubtnRef} onClick={handleTogglePostOptions} />
                                        {openMoreOptions && <PostMoreOptions uid={userId} postid={postId} />}
                                    </div>
                                }
                            </div>
                            <hr style={{ marginTop: '3px', boxShadow: '0px 3px 4px gray' }} />
                            {txt === "" ? '' :
                                <>
                                    <h4 className={classes.postText} dangerouslySetInnerHTML={{ __html: applyHighlights(txt) }}></h4>
                                    <hr style={{ marginTop: '3px', marginBottom: 0, boxShadow: '0px 2px 4px gray' }} />
                                </>
                            }
                            <div className={classes.postOptions}>

                                {viewOnly ?
                                    <>
                                        <div>
                                            <span className="blue font-weight-bold" >{likeCount + " Like"}</span>
                                        </div>
                                    </> :
                                    <div>
                                        <ThumbUp className={show2} onClick={likeHandle} />
                                        <h3 className={show2} onClick={openLikeListModal} >
                                            <span style={{ fontSize: "small" }} >{likeCount + (likeCount === 1 ? " Like" : " Likes")}</span>
                                        </h3>
                                    </div>
                                }
                                <div>
                                    <ChatIcon style={{ color: 'purple', marginRight: '3px' }} />
                                    <h3>{commentcount ? (commentcount) + " " : ""} Comment</h3>
                                </div>
                                <div className={classes.share}>
                                    <ShareIcon />
                                    <button onClick={share} style={{ border: "none", outline: "none", background: "inherit" }}>Share</button>
                                </div>
                                <div id="shareModal2" className="share-modal" style={{ display: 'none' }}>
                                    <div className="share-modal-content">
                                        <span id="closeshare" onClick={closeshare}>&times;</span>
                                        <div id="share-container">
                                            <div className="share-via">
                                                <button className="share-via-button" >
                                                    <WhatsAppIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <small style={{ marginLeft: '10px', color: 'gray' }}>{time_ago(ts)}</small>
                            <hr style={{ marginBottom: '3px', marginTop: 0, boxShadow: '0px 2px 4px gray' }} />
                            <div className={classes.comments}>
                                {commentL.map(Comments)}
                                {showMoreComment && <p id="showMoreComment"></p>}
                                {message !== '' ? <p className="text-center"><small>{message}</small></p> : ''}
                            </div>
                            {viewOnly ? null :
                                <div className={classes.writeComment}>
                                    <form onSubmit={postComment}>
                                        <div className="commentBox">
                                            <Avatar
                                                className="post__avatar2"
                                                alt={origusername}
                                                src={origuserdp}
                                            />
                                            <input className="commentInputBox" type="text" placeholder="Write a comment ... "
                                                value={comment} onChange={(e) => setComment(e.target.value)} />
                                            <input type="submit" disabled={!comment} className="transparent__submit" />
                                        </div>
                                        <p className="pressEnterToPost">Press Enter to post comment</p>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                    <Modal open={showLikeList}>
                        <div className={likeListClasses.main}>
                            <div>
                                <div className={likeListClasses.heading}>
                                    <h6>Who liked the post ?</h6>
                                    <CancelIcon className={likeListClasses.closeBtn} onClick={closeLikeList} />
                                </div>
                                <LikeList for="post" postid={postId} clips={clips} />
                            </div>
                        </div>
                    </Modal>
                    <EditPostModal />
                </div>
            </>
        );
    }
}



export default Post;
