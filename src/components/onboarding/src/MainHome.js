import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../../config/firebase.js";
import firebase from "firebase";
import "./styles/MainHome.css";
import "react-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import translateIcon from "./images/translate-icon.png";
import applogo from "./images/logo-removebg-preview.png";
import applex from "./images/OIP-removebg-preview 1.png";
import explore from ".//images/imageedit_1_4694143777.png";
import download from "./images/iconfinder_logo_brand_brands_logos_playstore_google_2993672 1.png";
import slices from "./images/Rectangle 14.png";
import s1 from "./images/Screenshot_2021-03-02-16-38-57-075_com.applex 1.png";
import s2 from "./images/Screenshot_2021-03-02-16-38-46-848_com.applex 1.png";
import s3 from "./images/Screenshot_2021-03-02-16-38-52-123_com.applex 1.png";
import useScrollSnap from "react-use-scroll-snap";
import Carousel from "react-bootstrap/Carousel";
import tirupati from "./images/tirupati.jpg";
import holi from "./images/holi.jpg";
import durgapuja from "./images/durga-puja.jpg";
import ganpati from "./images/ganpati.jpg";
import diwali from "./images/diwali.jpg";
import laptopImage from "./images/laptopOver.png";
import southIndianGirlImage from "./images/southIndian.png";
import demoImageBottom from "./images/appDemoImage.png";
import playStoreImage from "./images/playStoreImage.png";
import google_icon from "../../images/google_icon.svg";
import swal from "sweetalert";

import { Link, Redirect, useHistory } from "react-router-dom";

function MainHome() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  function HandleClick() {
    window.location.hash = "#sec1";
    document.querySelector("#navbar").classList.remove("navbar2");
  }
  function HandleClick1() {
    window.location.hash = "#sec2";
    document.querySelector("#navbar").classList.add("navbar2");
  }
  function HandleClick2() {
    window.location.hash = "#sec3";
    document.querySelector("#navbar").classList.remove("navbar2");
  }
  function HandleClick3() {
    window.location.hash = "#sec4";
    document.querySelector("#navbar").classList.add("navbar2");
  }
  function HandleClick4() {
    window.location.hash = "#sec5";
    document.querySelector("#navbar").classList.remove("navbar2");
  }
  const history = useHistory("");
  function next_page() {
    history.push("/login");
  }
  function register_page() {
    history.push("/register");
  }
  const handleScroll = () => {
    window.location.hash = "";
    const main = document.querySelector(".main");

    console.log(main.scrollTop, window.innerHeight);
    if (main.scrollTop < window.innerHeight) {
      document.querySelector("#navbar").classList.remove("navbar2");
    }
    if (
      main.scrollTop >= 1 * window.innerHeight &&
      main.scrollTop < 2 * window.innerHeight
    ) {
      document.querySelector("#navbar").classList.add("navbar2");
    }

    if (
      main.scrollTop >= 2 * window.innerHeight &&
      main.scrollTop < 3 * window.innerHeight
    ) {
      document.querySelector("#navbar").classList.remove("navbar2");
    }

    if (
      main.scrollTop >= 3 * window.innerHeight &&
      main.scrollTop < 4 * window.innerHeight
    ) {
      document.querySelector("#navbar").classList.add("navbar2");
    }

    if (main.scrollTop >= 4 * window.innerHeight) {
      document.querySelector("#navbar").classList.remove("navbar2");
    }
  };

  const handleLoginShrink = () => {
    document.querySelector("#loginOverlay").classList.toggle("shrink-down");
    let iT = document.querySelector("#logText").innerText;
    if (iT === "Log-In") {
      document.querySelector("#logText").innerText = "Sign-Up";
    } else {
      document.querySelector("#logText").innerText = "Log-In";
    }
  };

  const goToLogin = () => {
    console.log("Login");
    window.location.hash = "#sec5";
    document.querySelector("#loginOverlay").classList.remove("shrink-down");
    document.querySelector("#logText").innerText = "Sign-Up";
  };

  const goToSignUp = () => {
    window.location.hash = "#sec5";
    document.querySelector("#loginOverlay").classList.add("shrink-down");
    document.querySelector("#logText").innerText = "Log-In";
  };

  useEffect(() => {
    document.querySelector(".main").addEventListener("scroll", handleScroll);

    document
      .querySelector("#loginShrink")
      .addEventListener("click", handleLoginShrink);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const provider = new firebase.auth.GoogleAuthProvider();

  const register = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((s) => {
        history.push({
          pathname: "/registerpage",
          state: { googleSignin: false },
        });
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  async function google_login(event) {
    event.preventDefault();
    const res = await firebase.auth().signInWithPopup(provider);

    const check = await db.collection("Users").doc(res.user.uid).get();

    if (!check.exists) {
      swal("Oops!", "No such account exists", "error");
      auth.signOut();
      history.replace("/onboarding#sec5");
    } else {
      history.replace({ pathname: "/home", state: { googleSignin: true } });
    }
  }

  async function google_signin(event) {
    event.preventDefault();

    const res = await firebase.auth().signInWithPopup(provider);

    // console.log(res.user.uid);
    // const email = res.user.email;

    const checkDoc = await db.collection("Users").doc(res.user.uid).get();

    // if (check.empty)
    if (!checkDoc.exists)
      history.push({
        pathname: "/registerpage",
        state: { googleSignin: true },
      });
    else {
      alert("Account already exists!");
      auth.signOut();
      // history.push("/onboarding#sec5"); // redundant as user is already there
    }
  }

  const login = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        //console.log(auth);
        history.replace({ pathname: "/home", state: { googleSignin: false } });
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
          history.replace("/onboarding#sec5");
          window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
          });
        } else {
          swal("Oops!", e.message, "error");
        }
      });
  };

  return (
    <>
      <button className="mbtn mbtn-tran">
        <img
          src={translateIcon}
          alt=""
          id="language"
          className="nav__menu-list__item-tran"
        />
      </button>
      <ul className="nav-dots" id="js-dots">
        <li className="nav-dot" onClick={HandleClick} />
        <li className="nav-dot" onClick={HandleClick1} />
        <li className="nav-dot" onClick={HandleClick2} />
        <li className="nav-dot" onClick={HandleClick3} />
        <li className="nav-dot" onClick={HandleClick4} />
      </ul>
      <div className="nav" id="navbar">
        <div className="nav__logo">
          <img className="nav__logo--img" src={applogo} alt="Utsav logo" />
        </div>
        <ul className="clear nav__menu-list">
          <li className="nav__menu-list__item">
            <button type="button" className="mbtn mbtn-log" onClick={goToLogin}>
              LOGIN
            </button>
          </li>
          <li className="nav__menu-list__item">
            <button
              type="button"
              className="mbtn mbtn-sign"
              onClick={goToSignUp}
            >
              SIGN UP
            </button>
          </li>
        </ul>
      </div>
      <div className="main">
        <section className="section section1" id="sec1">
          <div className="section-bar">
            <header className="section1__head">
              <div className="section1__head--header">Utsav</div>
              <div className="section1__head--header-sub">
                Let's Explore more of india
              </div>
            </header>
            <div className="section1__download">
              <a
                href="https://play.google.com/store/apps/details?id=com.applex.utsav"
                className="section1__download--link"
                target="blank"
              >
                <img
                  src={playStoreImage}
                  alt=""
                  className="section1__download--link-img"
                />
              </a>
            </div>
          </div>
          <div className="tandc">
            <a href="#" alt="" className="link">
              Terms
            </a>
            <a href="#" alt="" className="link">
              Privacy
            </a>
            <a href="#" alt="" className="link">
              Support
            </a>
          </div>
        </section>
        <section className="section section2" id="sec2">
          <div className="section2__des-all">
            <div className="section2__des">
              <div className="section2__des-group">
                <div className="section2__des-group--head section2__main-head">
                  About Utsav
                </div>
                <div className="section2__des-group--head-sub section2__main-head-sub">
                  India is now at your fingertips.
                </div>
                <div className="section2__des-group--head-sub section2__main-head-sub">
                  Let's soak in the mood of celebration with Utsav.
                </div>
              </div>
              <div className="section2__des-group">
                <div className="section2__des-group--head">Explore</div>
                <div className="section2__des-group--head-sub">
                  Utsav is here to let you virtually explore the diverse
                  country.
                </div>
              </div>
              <div className="section2__des-group">
                <div className="section2__des-group--head">Experience</div>
                <div className="section2__des-group--head-sub">
                  It's profuse culture, heritage and famous festivities.
                </div>
              </div>
              <div className="section2__des-group">
                <div className="section2__des-group--head">Expand</div>
                <div className="section2__des-group--head-sub">
                  If you are a travel geek and want to explore more of the
                  country.
                </div>
              </div>
            </div>
            <div className="section2__imgC">
              <div className="section2__imgC-area">
                <div className="section2__imgC-area--box"></div>
                <img
                  src={laptopImage}
                  alt=""
                  className="section2__imgC-area--laptop"
                />
              </div>
            </div>
          </div>

          <div className="tandc">
            <a href="#" alt="" className="blink">
              Terms
            </a>
            <a href="#" alt="" className="blink">
              Privacy
            </a>
            <a href="#" alt="" className="blink">
              Support
            </a>
          </div>
        </section>
        <section className="section section3" id="sec3">
          <img src={southIndianGirlImage} alt="" className="southIndian" />
          <div className="section3__overlay"></div>
        </section>
        <section className="section section4" id="sec4">
          <header className="section4__head">
            <div className="section4__head-main">Utsav</div>
            <div className="section4__head-sub">
              Click selfies or portraits with Indian heritage sites and
              festivals!
            </div>
            <div className="section4__head-sub">
              Record a short video or express your mood with words!
            </div>
          </header>

          <div className="section4__bottom-overlay">
            <img
              src={demoImageBottom}
              alt=""
              className="section4__bottom-overlay--img"
            />
          </div>
        </section>
        <section className="section section5" id="sec5">
          <div className="section5__back"></div>
          <div className="section5__box">
            <header className="section5__box-header">
              <div className="section5__box-header-logobox">
                <img
                  src={applogo}
                  alt=""
                  className="section5__box-header-logobox--img"
                />
              </div>
              <div className="section5__box--header-detbox">
                <div className="section5__box--header-detbox__head">Utsav</div>
                <div className="section5__box--header-detbox__head-sub">
                  Let's Explore more of India
                </div>
              </div>
            </header>
            <div className="section5__cover">
              <form className="section5__box-signup">
                <div className="section5__input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="section5__input-group--input"
                  />
                </div>
                <div className="section5__input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="section5__input-group--input"
                  />
                </div>
                <div className="section5__input-group">
                  <button className="section5__btn" onClick={register}>
                    Sign Up
                  </button>
                </div>
                <div className="section5__btn-divi">- OR -</div>
                <div className="section5__input-group">
                  <button
                    className="section5__btn google-btn"
                    onClick={google_signin}
                  >
                    Sign Up with Google{" "}
                    <img src={google_icon} alt="" className="google-icon" />
                  </button>
                </div>
              </form>
              <form
                className="section5__box-signup section5__box-login shrink-down"
                id="loginOverlay"
              >
                <div className="shrink-down-top" id="loginShrink">
                  <span className="shrink-down-sm">or</span>
                  <span id="logText">Log-In</span>
                </div>
                <div className="section5__input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="section5__input-group--input"
                  />
                </div>
                <div className="section5__input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="section5__input-group--input"
                  />
                </div>
                <div className="section5__forgotPass">
                  <a href="/home" id="forgot">
                    Forgot password?
                  </a>
                </div>
                <div className="section5__input-group">
                  <button className="section5__btn" onClick={login}>
                    Log In
                  </button>
                </div>
                <div className="section5__btn-divi">- OR -</div>
                <div className="section5__input-group">
                  <button
                    className="section5__btn google-btn"
                    onClick={google_login}
                  >
                    Log In with Google{" "}
                    <img src={google_icon} alt="" className="google-icon" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MainHome;
