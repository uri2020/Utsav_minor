import React from 'react'
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {  db } from "../config/firebase.js";
import Navbar from "../Nav/nav.js";
import Trending from '../Others/Trending_hashtags.js';
import Sidebar1 from '../Sidebars/Sidebar_1.js';
import SingleNotification from './Notification.js';

import UpvotePujoRow from '../Sidebars/UpvotePujoRow';


import Translate from "../Translate/Translate";
import './styles/Notifications.css';
import Preloader from '../Others/Preloader.js';
import NoNotifImage from '../images/no-notif.png';

import Logo from "../images/logo.png";
import SplashScreen from '../SplashScreen/SplashScreen.js';
export default function AllNotifications(props) {
    const user = props.user;
    const uid = user.uid;
    const history = useHistory('');
    const [communitties, setCommitties] = useState([]);
    const [message, setMessage] = useState('');
    const [showMoreNotif, setShowMoreNotif] = useState(true);
    const lang = props.lang;
    if (user === false) {
        history.push("/login")
    }
    const [notifs,setNotifs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [firstNotif,setFirstNotif] = useState(false);
    const [noNotif,setNoNotif] = useState(NoNotifImage);
    const [logo,setLogo] = useState(Logo);
//     const querySnapshot = admin.firestore().collection('users').doc('uid').collection('sub-collection').limit(1).get()
// if (querySnapshot.empty) {console.log('sub-collection not existed')}
    useEffect(() => {
            //alert(uid);
    db.collection("Users").doc(uid).collection("notifications").get().then((snap) => {
        if(snap.empty){
            //alert("not exists");
            setLoading(false);
            setFirstNotif(true);
        }
        else {
        //alert("42.")
        db.collection("Users").doc(uid).collection("notifications").orderBy("datenotif","desc").limit(6).onSnapshot((snapshot) => {
                
           setNotifs(snapshot.docs.map(doc => ({
                   id: doc.id,
                   notif: doc.data(),
               })));
               setShowMoreNotif(true)
             });
             setLoading(false);
             setFirstNotif(false);
       }
    })
        
    },[uid])
    useEffect(() => {
        db.collection("Users").where('type', '==', 'com').onSnapshot((snapshot) => {
            setCommitties(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })));
        })
    }, []);
    function showMore(entries) {
    //console.log("hello");
        if (entries[0] && entries[0].isIntersecting && notifs[0]) {
                updateNotifs();
        }
    }
    
    let options = {
        rootMargin: '0px',
        threshold: 0.1
    }
    
    const element = document.getElementById('showMoreNotif');
    if (element) {
        let observer = new IntersectionObserver(showMore, options);
        observer.observe(element);
    }

    function updateNotifs() {
        const last = notifs[notifs.length - 1].notif.datenotif;
        //console.log("last"+last)
        
        setShowMoreNotif(false);
        setMessage("Loading...");
        db.collection("Users").doc(uid).collection("notifications").orderBy("datePost","desc").startAfter(last).limit(4).get()
                .then((snapshot) => {
                    const array = snapshot.docs.map(doc => ({
                        id: doc.id,
                        notif: doc.data(),
                    }));
                   // console.log("added"+array);
                    if (array.length === 0) {
                        setMessage('No more notifications to show.')
                    }
                    else {
                        setNotifs([...notifs,...array]);
                        setMessage('');
                        setShowMoreNotif(true);
                    }
                });
    }
    const NotificationRow = (props) => {
        //alert(props.time);
        return (
            <>
                
                {props.seen === "yes" && (
                    <div className="full-notification">
                    <span className="notification-time" style={{padding:"5px",color:"darkgrey"}}>{time_ago(props.time)}</span>
                                  
                          <SingleNotification
                          imgsrc={props.imgsrc}
                          userid={props.userid}
                          origuid={uid}
                          username={props.username}
                          type={props.type}
                          comment={props.comment}
                          postid = {props.postId}
                          time={time_ago(props.time)}
                          notifid={props.notifid}
                          />        
                    </div>
                )}
                {props.seen === "no" && (
                    <div className="full-notification" style={{backgroundImage: "linear-gradient(to bottom right,rgb(255,255,224,0),rgb(255, 255, 224,1))"}}>
                    <span className="notification-time"  style={{padding:"5px",color:"darkgrey"}}>{time_ago(props.time)}</span>
                                  
                          <SingleNotification
                          imgsrc={props.imgsrc}
                          userid={props.userid}
                          origuid={uid}
                          username={props.username}
                          type={props.type}
                          comment={props.comment}
                          postid = {props.postId}
                          time={time_ago(props.time)}
                          notifid={props.notifid}
                          />        
                    </div>
                )}
                
            </>
        );
    }

    const Notification = (notifdata) => {
        const notifData = notifdata.notif;

        return (
            <NotificationRow
                key={notifdata.id}
                notifid={notifdata.id}
                username={notifData.username}
                userid={notifData.userid}
                imgsrc={notifData.imgsrc}
                time={notifData.datenotif}
                postId={notifData.postid}
                type={notifData.type}
                comment={notifData.commenttext}
                seen={notifData.seen}
                />
        );

    }
    function time_ago(time) {

        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 's', 1], // 60
            [120, '1 minute', '1 min from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ', '1h from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, '1 week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, '1 month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, '1 year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, '1 century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;
    
        if (seconds === 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0,
            format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1];
            }
        return time;
    }
    const UpvotePujo = (cvalue) => {
        if (cvalue.id === uid) {
            return "";
        }
        else {
            return (
                <UpvotePujoRow
                    key={cvalue.id}
                    id={cvalue.id}
                    name={cvalue.data.name}
                    imgsrc={cvalue.data.dp}
                    uid={uid}
                />
            );
        }
    }
    
        return (
            
            <div className="container-fluid home" >
                <Navbar user={user} />
               
             <div className="home-main" style={{minHeight:"100%"}} >
             <Sidebar1 user={user} lang={lang}/>
             <div className="app__notifs" style={{marginTop:"10px"}}>
             {/* {notifs.length === 0 && 
                 <center>
                 <div style={{width:"300px"}}>
                     <img alt="No Notifications" src={noNotif} width="200" height="200"></img>
                 </div>
                 <div>No notifications yet!</div>
                 </center>
                 
             } */}
             {firstNotif && 
             <div id="notif-page-items">
                 <div className="full-notification" >
                                  
                          <SingleNotification
                          
                          
                          type="application"
                          />        
                    </div>  
             </div>
             }
             {!firstNotif && !loading && 
             <>
             <div id="notif-page-items" >
             {
             notifs.map(Notification)
             }
             </div>
             <div>
               {showMoreNotif && <div id='showMoreNotif' style={{borderBottom:"none"}}></div>}
               {message !== '' ? <p>{message}</p> : ''}
             </div>
             </>
             }
             {!firstNotif && loading && 
                <div>Loading..</div>}
            </div>
                <div className="sidebar2" >
                <Trending lang={lang}/> 
                <div className="upvote-pujo">
                    <h5 className="upvote-pujo-heading" data-aos="fade-left" data-aos-offset="20"><Translate lang={lang}>Upvote Pujo</Translate></h5>
                    <div className="upvote-pujo-list">
                        {communitties.map(UpvotePujo)}
                    </div>
                </div>
                </div>
             </div> 
            </div>
        )
    
}
// {props.seen === "yes" ? <span id="seen" style={{float:"left"}}></span> : ""}  
                
