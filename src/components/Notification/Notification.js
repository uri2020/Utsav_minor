import React from 'react'
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { db } from "../config/firebase.js";
import Navbar from "../Nav/nav.js";
import Like from "../images/like.png";
import Chat from "../images/chat.svg";

import Logo from "../images/logo.png";
import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,

  },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
export default function SingleNotification(props) {
  const [like_pic, setLikepic] = useState(Like);
  const [chat_pic, setChatpic] = useState(Chat);

  const history = useHistory();
  const classes = useStyles();

  const notifid = props.notifid;
  //console.log("notifid single Notification"+notifid);
  const userId = props.userid;
  const viewOnly = props.origuid === undefined ? true : false;
  const [logo,setLogo] = useState(Logo);
  //alert("here"+props.origuid);
  function viewProfile() {
    //alert("but inside")
    // history.push({ pathname: "/profile", state: { id: userId } });
    history.push("/profile/" + userId);

  }

  function viewNotif() {
    history.push({ pathname: "/posts/false/" + props.postid, state: { notifid: notifid } });
  }
  return (
    <div className="notification-list-items profile-container">
      {props.type === "like" ? (<div className={classes.root}>
        <Badge overlap="circle" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} badgeContent={<SmallAvatar src={like_pic} />}>
          <Avatar alt={props.username} src={props.imgsrc} onClick={viewProfile} />
        </Badge>
      </div>) : props.type === "comment" ? (<div className={classes.root}>
        <Badge overlap="circle" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} badgeContent={<SmallAvatar src={chat_pic} />}>
          <Avatar alt={props.username} src={props.imgsrc} onClick={viewProfile} />
        </Badge>
      </div>) : props.type === "application" ? 
      
      <div className={classes.root}>
        <Avatar alt="Utsav" src={logo}/>
      </div>
      :(<div className={classes.root}>

        <Avatar alt={props.username} src={props.imgsrc} onClick={viewProfile} />

      </div>)}
      <div style={{textAlign:"left"}}>
        {props.type === "application" ? 
        <span className="notification-user">Utsav</span>
        : <span className="notification-user" onClick={viewProfile}>{props.username + " "}</span>}

        {props.type === "share" ? <span onClick={viewNotif}>shared a post.</span> :
          props.type === "like" ? <span onClick={viewNotif}>liked your post.</span> :
          props.type === "application" ? <span> Welcome to Utsav start sharing, posting, browsing through various festivals.</span> :
            props.type === "comment" ? <><span onClick={viewNotif}>commented on your post.</span>
              <br></br><input readOnly type="text" value={" " + props.comment.slice(0, 9)} style={{ border: "none", borderRadius: "5px", width: "100%", height: "1.5rem", backgroundColor: "#f1f1f1", marginBottom: "5px" }}></input><br></br></> : <p></p>}

        
      </div>
    </div>
  )
}
