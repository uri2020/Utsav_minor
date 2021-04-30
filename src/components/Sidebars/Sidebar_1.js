import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from "../config/firebase.js";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// import LanguageIcon from '@material-ui/icons/Language';
// import InvertColorsIcon from '@material-ui/icons/InvertColors';
// import ShareIcon from '@material-ui/icons/Share';
// import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
// import StarsIcon from '@material-ui/icons/Stars';
// import InfoIcon from '@material-ui/icons/Info';
// import SecurityIcon from '@material-ui/icons/Security';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import TrendingUpIcon from '@material-ui/icons/TrendingUp';
// import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import './styles/Sidebar_1.css';
import Translate from '../Translate/Translate.js';

const close_sidebar = () => {
    var sidebar = document.getElementById("side-menu");
    sidebar.style.left = "-100%";
}

const Sidebar1 = (props) => {

    const history = useHistory('');
    const username = localStorage.getItem("Username");
    const dp = localStorage.getItem("Dp");
    const type = localStorage.getItem("type")
    const follows = localStorage.getItem("follows");
    const visits = localStorage.getItem("visits");
    let upvotes = null;
    if( type === 'com')
        upvotes = localStorage.getItem("upvotes");
    const lang = props.lang;


    const logout = (event) => {
        event.preventDefault();
        auth.signOut();
        localStorage.removeItem('Username');
        localStorage.removeItem("Dp");
        localStorage.removeItem("city");
        if(type === 'indi')
            localStorage.removeItem("gender");
        if (type === 'com')
            localStorage.removeItem('upvotes');
        localStorage.removeItem("type");
        localStorage.removeItem('visits');
        localStorage.removeItem('follows');
        history.push("/login");
    }

    function viewProfile() {
        history.push("/profile/" + props.user.uid);
    }

    return (
        <div className="sidebar" id="side-menu">
            <div className="close-icon">
                <ArrowBackIosIcon onClick={close_sidebar} />
            </div>
            <div>
                    
                <div onClick={viewProfile}>
                    <img src={dp} alt={username} className="profile-pic" />
                    <h5 className="username">{username}</h5>
                </div>
            </div>
            <div className="forTesting">
                <p>{follows + "  Follows"}</p>
                {type === 'com' ? <p>{ upvotes + "  Upvotes"}</p> : null}
                <p>{visits + "  Visits"}</p>
            </div>
            {/* <hr />
            <ul>
                <li className="sidebar-link-container" key="1" data-aos="slide-right" data-aos-offset="10">
                    <LanguageIcon className="sidebar-icon" fontSize="small" />
                    <Link to='#' className="sidebar-link"> Select language</Link>
                </li>
                <li className="sidebar-link-container" key="2" data-aos="slide-right" data-aos-offset="10">
                    <InvertColorsIcon className="sidebar-icon" fontSize="small" />
                    <Link to="#" className="sidebar-link">Set Theme</Link>
                </li>
                <li className="sidebar-link-container trending-hashtag-sidebar" key="3" data-aos="slide-right" data-aos-offset="10">
                    <TrendingUpIcon className="sidebar-icon" fontSize="small" />
                    <Link to="#" className="sidebar-link">Trending hashtags</Link>
                </li>
            </ul>
            <hr />
            <h6>Communication</h6>
            <ul>
                <li className="sidebar-link-container" key="1" data-aos="slide-right" data-aos-offset="10">
                    <ShareIcon className="sidebar-icon" fontSize="small" />
                    <Link to="#" className="sidebar-link" >Share with friends</Link>
                </li>
                <li className="sidebar-link-container" key="2" data-aos="slide-right" data-aos-offset="10">
                    <PermContactCalendarIcon className="sidebar-icon" fontSize="small" />
                    <Link to="/contactus" className="sidebar-link">Contact us</Link>
                </li>
                <li className="sidebar-link-container" key="3" data-aos="slide-right" data-aos-offset="10">
                    <StarsIcon className="sidebar-icon" fontSize="small" />
                    <Link to="#" className="sidebar-link">Rate Us</Link>
                </li>
            </ul>
            <hr />
            <h6>Useful Information</h6>
            <ul>
                <li className="sidebar-link-container" key="1">
                    <InfoIcon className="sidebar-icon" fontSize="small" />
                    <Link to="/aboutus" className="sidebar-link">About Us</Link>
                </li>
                <li className="sidebar-link-container" key="2">
                    <SecurityIcon className="sidebar-icon" fontSize="small" />
                    <Link to="#" className="sidebar-link">Privacy</Link>
                </li>
            </ul>
            
                <li className="sidebar-link-container" >
                    <LanguageIcon className="sidebar-icon" fontSize="small"/>
                    <Link to="/languagesettings" className="sidebar-link"><Translate lang={lang}>Change Language</Translate></Link>
                </li>
            <hr /> */}
            {/* <h6>Account</h6> */}
            
        </div>
    );
}

export default Sidebar1;
