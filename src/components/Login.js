import React, { useState } from 'react'
import './styles/Login.css';
import { Link } from 'react-router-dom';
import { auth, db } from "./config/firebase.js";
import { useHistory } from 'react-router-dom';
import logo from './images/logo.png';
import AddCircleIcon from '@material-ui/icons/AddCircle';
//import Footer from '../Footer/Footer';
import google_icon from './images/google_icon.svg';
import firebase from 'firebase';
import visibility_icon from '@material-ui/icons/Visibility'


import swal from 'sweetalert';

//cards
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import harsh from './images/harsh.png'; //This is a Test image. Remove this after DB Connection of recent-login
import mehul from './images/mehul_bhai.png'; ////This is a Test image. Remove this after DB Connection of recent-login

const useStyles = makeStyles({
    root: {
        maxWidth: 140,
        position: 'relative',
        margin: '0 5px',
        flexGrow: 1
    },
    media: {
        maxWidth: 140,
        height: '9rem',

    },
    close: {
        position: 'absolute',
        right: '5px',
        top: '5px',
    }
});

function recent_login(e) {
    //console.log(e.target.attributes.uid.value);
    //alert("login");
}

function remove_card(e) {
    //console.log(e);
    //alert("remove");
}

const LoginCard = (props) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} data-aos="flip-left" data-aos-delay="400">
            <CardActionArea>
                <CancelIcon fontSize="inherit" aria-label="remove" className={classes.close} onClick={remove_card} />
                <CardMedia
                    className={classes.media}
                    image={props.imgsrc}
                    title={props.title}
                    onClick={recent_login}
                    uid={props.uid}
                />
                <Typography gutterBottom variant="body2" component="p" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {props.title}
                </Typography>
            </CardActionArea>
        </Card>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const history = useHistory('');
    const [password, setPassword] = useState('');

    const provider = new firebase.auth.GoogleAuthProvider();

    async function google_login() {
        const res = await firebase.auth().signInWithPopup(provider);

        const check = await db.collection("Users").doc(res.user.uid).get();

        if (!check.exists) {
            swal("Oops!","No such account exists","error");
            auth.signOut();
            history.replace("/login");
        }
        else {
            history.replace({pathname:"/", state:{googleSignin: true}});
        }

    }

    const login = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                //console.log(auth);
                history.replace({pathname:"/", state:{googleSignin: false}});
            })
            .catch((e) => {
                if (
                    e.message ===
                    "The password is invalid or the user does not have a password."
                ) {
                    swal("Oops!", "Please check your Password again", "error");
                } else if (
                    e.message ===
                    "There is no user record corresponding to this identifier. The user may have been deleted."
                ) {
                    swal("Oops!", "No such account exists", "error");
                    history.replace("/login");
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                } else {
                    swal("Oops!", e.message, "error");
                }
            })
    }

    return (
        <>
            <div className="container-fluid login-page">
                {/* <div className="container login-main"> */}
                    {/* <div className="row"> */}
                        {/* <div className="col-lg-5" data-aos="fade-right">
                            <h1 className="login-main-heading">
                                <img src={logo} alt="logo" className="logo" /> Utsav
                            </h1>
                            <h4 style={{ color: "grey" }}>Recent logins</h4>
                            <p style={{ color: "grey" }}>Click your picture or add an account</p>
                            <div className="recent-login"> */}
                                {/*max two login cards can be added. Don't add more than 2 login cards.
                            Fetch the data from database and add profile pic path in "imgsrc" and name in "title".
                            And the link in "link"*/}
                                {/* <LoginCard imgsrc={harsh} title="Harsh Gohil" uid="0001" />
                                <LoginCard imgsrc={mehul} title="Mehul Bhai" uid="0002" />
                                <div className="add-account">
                                    <a href="/register">
                                        <AddCircleIcon fontSize="large" />
                                    </a>
                                    <Link to="/register">
                                        <p className="add-account-text">Add account</p>
                                    </Link>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="col-lg-2">
                            <br />
                        </div> */}
                        
                        <div data-aos="flip-right">
                            <div className="login">
                                
                                <div className="login__container">
                                    <img src={logo} id="flogo"/>
                                    <p id="fname">UTSAV</p>
                                    <p id="ftext">Let's explore more of India</p>
                                    <br/>
                                    <p id="fjoin">Join the <span id="tagging">UTSAV</span></p>
                                    
                                    <input className="email" onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter your Email" />
                                
                                
                                    <input className="pass" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" />
                                    <a href="/" style={{color:"#cdcdcd"}} id="forgot">Forgot password?</a>
                                
                                
                                    <button type="submit" onClick={login} className="login__login btn btn-warning">Login</button>
                                    <p id="foption">Or</p>
                                    <button type="button" class="btn btn-warning " id="fgoogle" onClick={google_login}>Login with <img src={google_icon} id="g_icon"/></button>
                                    <div id="no_ac1"><p id="no_ac">Don't have account? <a href="/register">Signup</a></p></div>
                                                                        
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-lg-1">
                            <br />
                        </div>
                    </div> */}
                {/* </div> */}
                {/* <Footer /> */}
            </div>
        </>
    )
}

export default Login
