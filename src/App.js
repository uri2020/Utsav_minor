import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/Login';
import MainHome from './components/onboarding/src/MainHome';
import Register from './components/Registeration/Register.js';
import RegisterType from './components/Registeration/RegisterType.js';
import IndividualRegister from './components/Registeration/Individualregister';
import PujoRegister from './components/Registeration/Pujoregister';
import People from './components/Tabs/PeopleTab';
import Community from './components/Tabs/CommunityTab';
import Clips from './components/Tabs/ClipsTab';
import './App.css';
import { auth, db } from './components/config/firebase.js';
import AboutUs from './components/Static/AboutUs';
import ContactUs from './components/Static/ContactUs';
import Home from './components/Tabs/Home';
import HashtagFilteredPosts from './components/Posts/HashtagFilteredPosts';

import Createpost from './components/Posts/Createpost';

//import Editpost from './components/Posts/Editpost';
//import EditProfile from './components/Profile/EditProfile';

import { Redirect } from 'react-router-dom';
//aos for animation
//You must have aos installed to use it if not installed install using "npm install aos --save"
//For more information visit https://github.com/michalsnik/aos
import AOS from 'aos';
import 'aos/dist/aos.css';
import Profile from './components/Profile/Profile';

import PostPage from './components/Posts/PostPage';

import AllNotifications from './components/Notification/AllNotifications';
import SetLanguage from './components/Translate/SetLanguage';
import LinkPreview from './LinkPreview';
import AddNotification from './components/Notification/addNotification';
import SplashScreen from './components/SplashScreen/SplashScreen';
import InvalidPage from './components/InvalidPage/InvalidPage';


//For Animation
AOS.init({
  offset: 100,
  duration: 1000,
});



function App() {

  const [user, setuser] = useState([]);
  const lang = localStorage.getItem("utsavlang");
  useEffect(() => {

    if (user && user.uid !== '' && localStorage.getItem("Username") === null) {
      db.collection("Users").doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            
            localStorage.setItem('Username', data.name);
            localStorage.setItem('Dp', data.dp);
            localStorage.setItem('type', data.type);
            if (data.type === 'indi')
              localStorage.setItem('gender', data.gender);
            if (data.type === 'com')
              localStorage.setItem('upvotes',data.upvotes);
            localStorage.setItem('city', data.city);
            localStorage.setItem('visits',data.visits);
            localStorage.setItem('follows',data.follows);
          }
        });
    }
  }, [user], []);

  auth.onAuthStateChanged((authUser) => {
    //console.log(authUser);
    if (authUser) {
      setuser(authUser);
    } else {
      setuser(false);
    }
  });

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/onboarding">
            <MainHome />
          </Route> 
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/">
            <SplashScreen />
          </Route>
          <Route exact path="/home">
            <Home user={user} lang={lang}/>
          </Route>
          <Route exact path="/registerpage">
            <RegisterType /> {/*  SELECTING USER TYPE*/}
          </Route>
          <Route exact path="/individualregister">
            <IndividualRegister user={user} />
          </Route>
          <Route exact path="/pujoregister">
            <PujoRegister user={user} />
          </Route>
          <Route exact path="/profile/:id">
            <Profile user={user} />
          </Route>
          <Route exact path="/aboutus">
            <AboutUs />
          </Route>
          <Route exact path="/contactus" >
            <ContactUs />
          </Route>
          <Route exact path="/people" >
            <People user={user} lang={lang}/>
          </Route>
          <Route exact path="/community" >
            <Community user={user} lang={lang}/>
          </Route>
          <Route exact path="/clips" >
            <Clips user={user} lang={lang}/>
          </Route>
          <Route exact path="/posts/:clip/:postid" component={PostPage}>
          </Route>
          <Route exact path="/hashtag/:hashtag">
            <HashtagFilteredPosts user={user} lang={lang} />
          </Route>
          <Route exact path="/createpost">
            <Createpost user={user} />
          </Route>
          <Route exact path="/notifications">
            <AllNotifications user={user} lang={lang}/>
          </Route>
          <Route exact path="/addnotif">
            <AddNotification user={user} lang={lang}/>
          </Route>
          
          {/* <Route exact path="/editpost" children={<Editpost user={user} />}>
          </Route> */}
          {/* <Route exact path="/editprofile" children={<EditProfile user={user} />}>
          </Route> */}
          
          <Route exact path="/languagesettings" children={<SetLanguage user={user} />}>
          </Route>

          <Route exact path="/linkpreview">
            <LinkPreview/>
          </Route>
          <Route exact path="*">
            <InvalidPage user={user}/>
          </Route>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
