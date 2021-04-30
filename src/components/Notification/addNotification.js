import React from 'react'

import {  db } from "../config/firebase.js";
export default function AddNotification() {
   function add() {
    db.collection("Users").doc("rMUtQ61U22OrVA2Aw9FP37ASqUc2").collection("notifications").add({
        userid:"KlwSZ1QWm6SBclIKyIX98DjqkiC3",
        username:"Sourajit Basu",
        imgsrc:"https://firebasestorage.googleapis.com/v0/b/utsav-def1e.appspot.com/o/images%2FWhatsApp%20Image%202021-02-04%20at%209.43.23%20PM%20(1).jpeg?alt=media&token=c22e93c3-b04b-4c55-acfc-7aecb9d5c418",
        type:"comment",
        datenotif:"Wed Apr 06 2021 21:52:37 GMT+0530 (India Standard Time)",
        postid:"pep1A0i6AxzswYWy8LOP",
        commenttext:"wow",
        gender:"male",
        seen:"no"

    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    
   }
    return (
        <div>
            <button onClick={add}>Add</button>
            This is a sample page for inserting dummy notification.It will be deleted soon.
        </div>
    )
}
