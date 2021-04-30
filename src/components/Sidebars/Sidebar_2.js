import React, { useEffect, useState } from 'react';
// //import * as temp from 'moment';
// import Avatar from '@material-ui/core/Avatar';
import './styles/Sidebar_2.css';
import { db } from "../config/firebase.js";
//import upvote_pujo_data from "./data/upvote_pujo";
import { Link } from 'react-router-dom';
import UpvotePujoRow from './UpvotePujoRow';
import Trending from '../Others/Trending_hashtags';


import SidebarNotification from '../Notification/SidebarNotification.js';
import Translate from "../Translate/Translate";
//const moment = temp["default"];
import NoNotifImage from '../images/no-notif.png';
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
        [60, 'seconds', 1], // 60
        [120, '1 minute', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'century', 'Next century'], // 60*60*24*7*4*12*100*2
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
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ';
        }
    return time;
}

function Sidebar2({ user,lang }) {

    const uid = user.uid;
    //console.log(user.uid);
    const [notifAll, setNotifAll] = useState([]);
    const [noNotif,setNoNotif] = useState(NoNotifImage);
    const [communitties, setCommitties] = useState([]);
    

    useEffect(() => {
        async function getNotifData() {

            db.collection("Users").doc("rMUtQ61U22OrVA2Aw9FP37ASqUc2").collection("notifications").orderBy("datenotif", "desc")
                .onSnapshot((snapshot) => {
                    setNotifAll(snapshot.docs.map((doc) => {
                        return ({
                            id: doc.id,
                            data: doc.data(),
                        });

                    }
                    ));
                });

        }

        getNotifData();
    }, []);

    useEffect(() => {
        db.collection("Users").where('type', '==', 'com').onSnapshot((snapshot) => {
            setCommitties(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })));
        })
    }, []);
    

    const NotificationRow = (props) => {
        //alert(props.time);
        return (
            <>    
            {props.seen === "yes" ? (
                <li className="notification-list-item" >
                       
                <SidebarNotification
              imgsrc={props.imgsrc}
              userid={props.userid}
              origuid={uid}
              username={props.username}
              type={props.type}
              comment={props.comment}
              postid = {props.postId}
              time = {time_ago(props.time)}
              seen={props.seen}
              notifid={props.notifid}
              /> 
               
            </li>
            ):(
                <li className="notification-list-item" style={{backgroundImage: "linear-gradient(to bottom right,rgb(255,255,224,0),rgb(255, 255, 224,1))"}}>
                       
                        <SidebarNotification
                      imgsrc={props.imgsrc}
                      userid={props.userid}
                      origuid={uid}
                      username={props.username}
                      type={props.type}
                      comment={props.comment}
                      postid = {props.postId}
                      time = {time_ago(props.time)}
                      seen={props.seen}
                      notifid={props.notifid}
                      /> 
                       
                    </li>
            )}
                    
                 
                
            </>
        );
    }

    const Notification = (notifdata) => {
        const notifData = notifdata.data;

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
        <>
            <div className="sidebar2">
                <div className="notification">
                    <h5 className="notification-heading" data-aos="fade-left" data-aos-offset="20"><Translate lang={lang}>Notifications</Translate></h5>
                    {notifAll.length === 0 && <div style={{textAlign:"center"}}>
                        <div className="notification-list-item" style={{backgroundColor:"white"}}>
                        
                        <SidebarNotification type="application"/>
                        </div>
                    </div> }
                    { <ul className="notification-list" >
                        {notifAll.length >= 4 ? notifAll.slice(0,4).map(Notification) 
                        : notifAll.map(Notification)}
                        
                        
                        <li style={{textAlign:"center",padding:"0"}}><Link to="/notifications"><br></br><button className="see-all-notif-button" style={{margin:"0"}}>See All</button></Link></li>
                    </ul>
                    }
                    
                    
                    
                </div>
                
                    <Trending lang={lang}/>
                
                <div className="upvote-pujo">
                    <h5 className="upvote-pujo-heading" data-aos="fade-left" data-aos-offset="20"><Translate lang={lang}>Upvote Pujo</Translate></h5>
                    <div className="upvote-pujo-list">
                        {communitties.map(UpvotePujo)}
                    </div>
                </div>
            </div>
        </>
    );

}

export default Sidebar2;

// {props.seen === "yes" ? <span id="seen"></span> : ""}
