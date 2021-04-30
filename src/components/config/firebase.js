import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAzC2zUfGNbfGcB43zrlWksLBD44QOGjtg",
  authDomain: "utsav-def1e.firebaseapp.com",
  projectId: "utsav-def1e",
  storageBucket: "utsav-def1e.appspot.com",
  messagingSenderId: "565537410057",
  appId: "1:565537410057:web:13162bd34e32c36cf27cd8",
  measurementId: "G-HEQK7RVPNV"
});

const auth = firebase.auth();
const db = firebaseConfig.firestore();
const storage = firebase.storage();

export { auth, db, storage };

/* old 
apiKey: "AIzaSyC2S4-ZPWALVoQoyWRXUem2MEusY127P-I",
    authDomain: "utsav-webapp-aeab9.firebaseapp.com",
    projectId: "utsav-webapp-aeab9",
    storageBucket: "utsav-webapp-aeab9.appspot.com",
    messagingSenderId: "586733464137",
    appId: "1:586733464137:web:b80eaf42880a14cf876d98",
    measurementId: "G-JEB2EZPS34"
*/
