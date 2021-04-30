import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ClearIcon from '@material-ui/icons/Clear';
import classes from './styles/createpost.module.css';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import VideocamIcon from '@material-ui/icons/Videocam';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';
import { db, storage } from "../config/firebase.js";
import { checkUser } from '../Utilities/checkUser';
import Modal from '@material-ui/core/Modal';
import styles from '../Utilities/editimage.module.css';

import swal from 'sweetalert';

function CreatePost(props) {

    const history = useHistory('');
    const name = localStorage.getItem("Username");
    const dp = localStorage.getItem("Dp");
    const uid = props.user.uid;
    const type = localStorage.getItem("type");
    const [image, setImage] = useState([]);
    const [video, setVideo] = useState('');
    const [txt, settxt] = useState('');

    const [upImg, setUpImg] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [filename, setFilename] = useState('');
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    if (checkUser(props.user) === false)
        history.replace('/login');


    if (window.innerWidth > 750)
        history.push('/');

    window.addEventListener("resize", () => {
        if (window.innerWidth > 750)
            history.push('/');
    });

    const uploadFileWithClick = () => {
        document.getElementsByClassName('imageFile')[0].click()
    }

    const uploadVideoFileWithClick = () => {
        document.getElementById('videoFile').click()
    }

    const startCrop = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(file);
        }
    };


    function EditModal() {

        const imgRef = useRef(null);
        const previewCanvasRef = useRef(null);
        const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 4 / 3 });
        const [completedCrop, setCompletedCrop] = useState(null);

        const onLoad = useCallback((img) => {
            imgRef.current = img;
        }, []);

        useEffect(() => {
            if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
                return;
            }

            const image = imgRef.current;
            const canvas = previewCanvasRef.current;
            const crop = completedCrop;

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const ctx = canvas.getContext('2d');
            const pixelRatio = window.devicePixelRatio;

            canvas.width = crop.width * pixelRatio;
            canvas.height = crop.height * pixelRatio;

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

        }, [completedCrop]);

        function finishCrop() {
            setOpenEditModal(false);
            handleImageUpload(previewCanvasRef.current);
        }

        return (
            <>
                <Modal
                    open={openEditModal}
                >
                    <>
                        <div className={styles.main}>

                            <div className={styles.cropper}>
                                <h5>Edit Image</h5>

                                <ReactCrop
                                    src={upImg}
                                    onImageLoaded={onLoad}
                                    crop={crop}
                                    keepSelection={true}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    style={{ maxWidth: '60vh', maxHeight: '50vh' }}
                                />


                                <div className={styles.buttons}>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={!completedCrop?.width || !completedCrop?.height}
                                        onClick={finishCrop}
                                    >
                                        Done
                                    </button>
                                    <button className="btn btn-warning ml-4" onClick={() => setOpenEditModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.canvas}>
                            <canvas
                                ref={previewCanvasRef}
                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                style={{
                                    width: Math.round(completedCrop?.width ?? 0),
                                    height: Math.round(completedCrop?.height ?? 0)
                                }}
                            />
                        </div>
                    </>
                </Modal>
            </>
        );
    }

    function Progress() {
        return (
            <Modal
                open={showProgress}
            >
                <div className={styles.progress}>
                    <div className={styles.progressBarContainer}>
                        <progress value={progress} max="100" className={styles.progressBar} />
                        <p>Uploading...</p>
                    </div>
                </div>
            </Modal>
        );
    }


    function getImageData(canvas, fileName) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg', 1);
        });
    }


    const handleImageUpload = async (canvas) => {

        const file = await getImageData(canvas, filename);

        if (filename && file) {

            const uploadTask = storage.ref(`images/${filename}`).put(file);
            setProgress(0);
            setShowProgress(true);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then(url => {
                            setImage([...image, url]);
                            setShowProgress(false);
                        })
                }
            )
        }
    }

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {

            const fname = e.target.files[0].name;
            if (fname.endsWith('.jpg') || fname.endsWith('.jpeg') || fname.endsWith('.png')) {
                if (image.length > 9) {
                    swal("Oops!", "You can have maximum 10 photos in post!", "error");
                }
                else {
                    let name = e.target.files[0].name;
                    name = name.substring(0, name.lastIndexOf('.')) + ".png";
                    //console.log(name);
                    startCrop(e.target.files[0]);
                    setOpenEditModal(true);
                    setFilename(name);
                }
            }
            else {
                swal("Oops!", "Invalid format!", "error");
            }
        }
    }

    const handleUpload = (event) => {
        event.preventDefault()
        if ((image[0] === '' || video === '') && txt === '') {
            swal("Oops!", "Empty post!", "error");
        }
        else {
            handleClose();

            if (video === '') {

                db.collection("Feeds").add({
                    ts: Date.now(),
                    txt: txt,
                    img: image,
                    likecount: 0,
                    cmtNo: 0,
                    uid: uid,
                    type: type,
                    username: name,
                    userdp: dp
                });
            }
            else {

                db.collection("Clips").add({
                    ts: Date.now(),
                    txt: txt,
                    video: video,
                    likecount: 0,
                    cmtNo: 0,
                    uid: uid,
                    type: type,
                    username: name,
                    userdp: dp
                });
            }

            settxt("")
            setImage([]);
            setVideo('');
        }
    }

    // const handleChange = (e) => {
    //     if (e.target.files[0]) {

    //         const filename = e.target.files[0].name;

    //         if (image.length > 9) {
    //             swal("Oops!", "You can have maximum 10 photos in post!", "error");
    //         }
    //         else {
    //             if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
    //                 const uploadTask = storage.ref(`images/${e.target.files[0].name}`).put(e.target.files[0]);
    //                 setProgress(0);
    //                 const prog = document.getElementById("progress");
    //                 prog.style.display = "block";
    //                 uploadTask.on(
    //                     "state_changed",
    //                     (snapshot) => {
    //                         const progress = Math.round(
    //                             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //                         );
    //                         setProgress(progress);
    //                     },
    //                     (error) => {
    //                         console.log(error);
    //                         alert(error.message);
    //                     },
    //                     () => {
    //                         storage
    //                             .ref("images")
    //                             .child(e.target.files[0].name)
    //                             .getDownloadURL()
    //                             .then(url => {
    //                                 prog.style.display = "none";
    //                                 setImage([...image, url]);
    //                             })
    //                     }
    //                 )
    //             }
    //             else {
    //                 swal("Oops!", "Invalid format!", "error");
    //             }
    //         }
    //     }
    // }

    function handleVideoInputChange(e) {
        if (e.target.files[0]) {
            const filename = e.target.files[0].name;
            if (filename.endsWith('.mp4')) {
                const uploadTask = storage.ref(`videos/${e.target.files[0].name}`).put(e.target.files[0]);
                setProgress(0);
                const prog = document.getElementById("progress");
                prog.style.display = "block";
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage
                            .ref("videos")
                            .child(e.target.files[0].name)
                            .getDownloadURL()
                            .then(url => {
                                prog.style.display = "none";
                                setVideo(url);
                            })
                    }
                )
            }
            else {
                swal("Oops!", "Invalid format!", "error");
            }
        }

    }

    function handleClose() {
        history.push('/');
    }

    function deleteVideo() {
        setVideo('');
    }

    function deleteImage(e) {
        const index = e.currentTarget.attributes.index.nodeValue;
        let array = image;
        array.splice(index, 1);
        setImage([...array]);
    }

    function Photo(cvalue, index) {

        return (
            <div key={index} className="imageContainer">
                <img src={cvalue} alt="demo" width="80" height="60" />
                <CancelIcon fontSize="inherit" className="delete" index={index} onClick={deleteImage} />
            </div>
        );
    }

    function ImageGallery() {

        if (video !== '') {
            return (
                <div className="videoContainer">
                    <video width="100px" height="80px">
                        <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                    <CancelIcon fontSize="inherit" className="delete" onClick={deleteVideo} />
                </div>
            );
        }
        if (image !== '') {
            return (
                <>
                    {image.map(Photo)}
                </>
            );
        }
        else {
            return "";
        }

    }

    if (props.user.length === 0) {
        return "";
    }
    else {
        return (
            <div>
                <div className={classes.nav}>
                    <ClearIcon onClick={handleClose} />
                    <p>Create Post</p>
                    <button className="btn" onClick={handleUpload} >Post</button>
                </div>
                <hr style={{ margin: 0, backgroundColor: 'grey' }} />
                <div className={classes.main}>
                    <div className={classes.userDetails}>
                        <img
                            className={classes.avatar}
                            alt={name}
                            src={dp}
                        />
                        <p>
                            {name}
                        </p>
                    </div>
                    <div className={classes.input}>
                        <input type="text" onChange={(e) => settxt(e.target.value)} placeholder={`What's on your mind ${name} ?`} />
                        <input type="file" className="imageFile" onChange={handleChange} accept=".jpg, .jpeg, .png, .gif" />
                        <input type="file" id="videoFile" onChange={handleVideoInputChange} accept=".mp4" />
                    </div>
                    <div className="imageGallery">
                        <ImageGallery />
                    </div>
                    <div className={classes.uploadOptions}>
                        <div className={classes.uploadOptionsHeader}>
                            <h6>
                                Add to post
                        </h6>
                            <PhotoLibraryIcon className={classes.iconSmall} style={{ color: 'purple' }} onClick={uploadFileWithClick} />
                            <VideocamIcon className={classes.iconSmall} style={{ color: 'green' }} onClick={uploadVideoFileWithClick} />
                        </div>
                        <ul>
                            <li key="1" onClick={uploadFileWithClick}>
                                <PhotoLibraryIcon className={classes.iconBig} style={{ color: 'purple' }} fontSize='large' />
                            Photos
                        </li>
                            <li key="2" onClick={uploadVideoFileWithClick}>
                                <VideocamIcon className={classes.iconBig} style={{ color: 'green' }} fontSize='large' />
                            Video
                        </li>
                        </ul>
                    </div>
                </div>
                <EditModal />
                <Progress />
            </div>
        );
    }
}

export default CreatePost;