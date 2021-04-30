import firebase from 'firebase';

const config ={
    apiKey: "AIzaSyC2S4-ZPWALVoQoyWRXUem2MEusY127P-I",
    authDomain: "utsav-webapp-aeab9.firebaseapp.com",
    projectId: "utsav-webapp-aeab9",
    storageBucket: "utsav-webapp-aeab9.appspot.com",
    messagingSenderId: "586733464137",
    appId: "1:586733464137:web:b80eaf42880a14cf876d98",
    measurementId: "G-JEB2EZPS34"
   };
//    var fire = config.firestore();
//    fire=firebase.firestore(config);
//export default fire;

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

/*
apiKey: "AIzaSyDJdoTqBGCWnwYQLk_ALnFYSwVKHKQ4XVw",
    authDomain: "utsavlogin.firebaseapp.com",
    projectId: "utsavlogin",
    storageBucket: "utsavlogin.appspot.com",
    messagingSenderId: "812399260147",
    appId: "1:812399260147:web:e00ea8fa24770b2a126286"
*/

/*
apiKey: "AIzaSyC2S4-ZPWALVoQoyWRXUem2MEusY127P-I",
    authDomain: "utsav-webapp-aeab9.firebaseapp.com",
    projectId: "utsav-webapp-aeab9",
    storageBucket: "utsav-webapp-aeab9.appspot.com",
    messagingSenderId: "586733464137",
    appId: "1:586733464137:web:b80eaf42880a14cf876d98",
    measurementId: "G-JEB2EZPS34"
*/