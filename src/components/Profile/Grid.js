import React, { useState, useEffect } from 'react';
import { db } from "../config/firebase.js";
import Post from '../Posts/Post';
import GridView from './GridView';

const Grid = (props) => {
    const [Images, setImages] = useState([]);
    const userID = props.userId;
    // const userType = props.userType;
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        function getData() {
            if (userID) {
                db.collection("Feeds").where('uid', '==', userID).get()
                    .then((snapshot) => {

                        if (snapshot.docs.length === 0)
                            setMessage("No posts to show");
                        else {
                                const images = [];
                                snapshot.docs.forEach((doc) => {
                                    const data = doc.data().img;
                                    data.forEach((item) => {
                                        if(item !== '')
                                            images.push({ postid: doc.id, image: item });
                                    });
                                });
                                if(images.length === 0)
                                    setMessage('No images to show.');
                                else
                                    setImages([...images]);
                        }
                    })
            }
        }

        getData();

    }, [userID], []);

    if (Images[0]) {

        return (
            <>
                <div className="container">
                    <div className="row">
                        <div className="col-sm">
                            <GridView
                                img={Images}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (<p>{message}</p>);
    }

}

export default Grid;