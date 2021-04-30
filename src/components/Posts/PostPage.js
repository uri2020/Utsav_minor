import React, { useEffect, useState } from 'react';
import { auth, db } from "../config/firebase.js";
import { getPreviewFromContent, getLinkPreview } from 'link-preview-js';

import Post from './Post';
import { useHistory } from 'react-router';
const axios = require('axios');


export default function PostPage(props) {
  //console.log(JSON.stringify(props)+"<-props")
  const history = useHistory();
  const notifid = props.location.state ? history.location.state.notifid : "";
  const [user, setuser] = useState('');
  const origusername = localStorage.getItem('Username');
  const origuserdp = localStorage.getItem('Dp');
  const type = localStorage.getItem('type');
 
  const [postImg, setPostImg] = useState([]);
  const [postvideo, setPostvideo] = useState('');
  const [postUserId, setPostUserId] = useState("");
  const [postTxt, setPostTxt] = useState("");
  const [ts, setTs] = useState(0);
  const [postlikecount, setPostlikecount] = useState([]);
  const [commentcount, setCommentcount] = useState(0);
  const [postUserAbout, setPostUserAbout] = useState("");
  const [postUserName, setPostUserName] = useState("");
  const [postUserDp, setPostUserDp] = useState('');
  const [message, setMessage] = useState('Loading...');

  const postid = props.match.params.postid;
  const clip = props.match.params.clip;
  const clips = clip === 'true' ? true : false;

  const collection = clips ? 'Clips' : 'Feeds';
  useEffect(() => {
    if(notifid !== "")
    {
      db.collection("Users").doc("rMUtQ61U22OrVA2Aw9FP37ASqUc2").collection("notifications").doc(notifid).update({
        seen:"yes"
    });
    }
  })
  useEffect(() => {
    async function getData() {
      const postdata = await db.collection(collection).doc(postid).get();
      if (postdata.exists) {
        let data = postdata.data();
        if (clips)
          setPostvideo(data.video);
        else
          setPostImg(data.img);

        setPostTxt(data.txt);
        setPostUserId(data.uid);
        setPostlikecount(data.likecount);
        setCommentcount(data.cmtNo);
        setPostUserName(data.username);
        setPostUserDp(data.userdp);
        setTs(data.ts);
        setMessage('');
      }
      else {
        setMessage('No such post exists');
      }
      if (postdata != null && postUserId !== "") {
        const userdata = await db.collection("Users").doc(postUserId).get()

        if (userdata.exists) {
          let data = userdata.data()
          setPostUserAbout(data.about);
        }

      }
    }
    getData();
  }, [postid, postUserId, clips, collection]);

  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      setuser(authUser)
    } else {
      setuser(false);
    }
  })

  var titlecount = 0, descriptioncount = 0, urlcount = 0, imgcount = 0;
  //og:title,og:description,og:url,og:image,og:image:secure_url

  if (titlecount === 0 && postUserName !== "" && postUserAbout !== "") {
    var metatitle = document.createElement("meta");
    var propertytitle = document.createAttribute("property");
    propertytitle.value = "og:title";
    metatitle.setAttributeNode(propertytitle);
    var contenttitle = document.createAttribute("content");
    contenttitle.value = postUserName + " on applex.in #" + postUserAbout;
    metatitle.setAttributeNode(contenttitle);
    document.getElementsByTagName('head')[0].prepend(metatitle);
    titlecount = 1;
  }
  if (imgcount === 0 && postImg !== "") {
    var metaimg = document.createElement("meta");
    var propertyimg = document.createAttribute("property");
    propertyimg.value = "og:image";
    metaimg.setAttributeNode(propertyimg);
    var contentimg = document.createAttribute("content");
    contentimg.value = postImg;
    metaimg.setAttributeNode(contentimg);
    document.getElementsByTagName('head')[0].prepend(metaimg);
    imgcount = 1;
  }
  if (urlcount === 0 && postid !== "") {
    var metaurl = document.createElement("meta");
    var propertyurl = document.createAttribute("property");
    propertyurl.value = "og:url";
    metaurl.setAttributeNode(propertyurl);
    var contenturl = document.createAttribute("content");
    contenturl.value = document.location;
    metaurl.setAttributeNode(contenturl);
    document.getElementsByTagName('head')[0].prepend(metaurl);
    urlcount = 1;
  }
  //alert(postData.txt);
  if (descriptioncount === 0 && postTxt !== "") {

    var metadesc = document.createElement("meta");
    var propertydesc = document.createAttribute("property");
    propertydesc.value = "og:description";
    metadesc.setAttributeNode(propertydesc);
    var contentdesc = document.createAttribute("content");
    contentdesc.value = postTxt
    metadesc.setAttributeNode(contentdesc);
    document.getElementsByTagName('head')[0].prepend(metadesc);
    descriptioncount = 1
  }

  function Test(text) {
    const detectedUrl = text.match(/(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g);
    //console.log(detectedUrl);
    // axios.get("https://youtu.be/Az-mGR-CehY").then((res)=>{
    //   console.log(res);
    // })

    // if(detectedUrl.length > 0){
    //   getLinkPreview("https://youtu.be/Az-mGR-CehY", {
    //     imagesPropertyType: "og", // fetches only open-graph images
    //     headers: {
    //     "Access-Control-Allow-Origin": "https://youtu.be"
    //     }
    // }).then(data => console.log(data));
    // }
  }

  if (message === '') {

    Test(postTxt);

    return (

      <>
        <Post
          postId={postid}
          origuid={user.uid}
          origusername={origusername}
          origuserdp={origuserdp}
          origusertype={type}
          userId={postUserId}
          postusername={postUserName}
          postuserdp={postUserDp}
          txt={postTxt}
          img={postImg}
          ts={ts}
          video={postvideo}
          clips={clips}
          likecount={postlikecount}
          commentcount={commentcount}
          viewSinglePost={true}
        />
      </>
    )
  }
  else {
    return (<p className="text-center m-4">{message}</p>)
  }
}

/*
<div>
      <h1>Details for Link preview for individual post</h1><br></br>
      <b>Post id:</b>{props.match.params.postid}<br></br>
      <b>Post image:</b>{postImg}<br></br>
      <b>Post Text:</b>{postTxt}<br></br>
      <b>Posted user about:</b>{postUserAbout}<br></br>
      <b>Posted user name:</b>{postUserName}<br></br>
      <b>Taken Reference:</b><a href="https://andrejgajdos.com/how-to-create-a-link-preview/">Documentation for Link preview.</a><br></br>
      <strong>For testing:</strong>Download open graph tool debugger chrome extension
    </div>
*/
