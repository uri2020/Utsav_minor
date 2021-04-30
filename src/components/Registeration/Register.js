import React, { useState } from "react";
import "./styles/Register.css";
import { auth, db } from "../config/firebase.js";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import logo from "../images/logo.png";
import google_icon from "../images/google_icon.svg";

function Register() {
  const history = useHistory("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const provider = new firebase.auth.GoogleAuthProvider();

  async function google_signin() {
    const res = await firebase.auth().signInWithPopup(provider);

    console.log(res.user.uid);
    // const email = res.user.email;
    const check = await db.collection("Users").where(res.user.uid).get();

    if (check.empty)
      history.replace({
        pathname: "/registerpage",
        state: { googleSignin: true },
      });
    else {
      alert("Account already exists!");
      auth.signOut();
      history.push("/login");
    }
  }

  const register = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((s) => {
        history.replace({
          pathname: "/registerpage",
          state: { googleSignin: false },
        });
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <div className="register">
      <div className="head" data-aos="slide-right">
        <img src={logo} alt="logo" className="register-logo" />
        <h3>Utsav</h3>
      </div>
      <div className="register__container" data-aos="flip-right">
        <h4>Create A New Account</h4>
        <span className="small">experience the world of celebration</span>
        <hr />
        <form>
          <div className="form-group">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <p className="register__policy">
            By clicking Sign Up, you agree to our
            <span> Terms, Data Policy</span> and <span>Cookie Policy</span>. You
            may recieve SMS notifications from us and can opt out at any time.
          </p>
          <button
            onClick={register}
            type="submit"
            className="register__register"
          >
            Register
          </button>
          <div className="signup-options">
            <small>Or Sign up with </small>
            <span onClick={google_signin}>
              <img
                src={google_icon}
                alt="google"
                className="sigin_google_icon"
              />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
