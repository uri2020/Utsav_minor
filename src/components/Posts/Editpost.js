

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import style from './styles/editpost.module.css';
import { Avatar } from '@material-ui/core';
import { storage, db } from "../config/firebase.js";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CancelIcon from '@material-ui/icons/Cancel';
import Modal from '@material-ui/core/Modal';
import styles from '../Utilities/editimage.module.css';
import ClearIcon from '@material-ui/icons/Clear';
import swal from 'sweetalert';

function Editpost(props) {

    const postId = props.postid;
    const clips = props.clips;

    const usN = localStorage.getItem('Username');
    const dp = localStorage.getItem("Dp");
    const [image, setImage] = useState([...props.images]);
    const [video, setVideo] = useState(props.video === undefined ? '' : props.video);
    const [txt, settxt] = useState(props.txt);

    const [upImg, setUpImg] = useState();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [filename, setFilename] = useState('');
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);


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
                                    style={{ maxWidth: "60vw", maxHeight: '60vh' , overflow: 'scroll' }}
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


    const uploadFileWithClick = () => {
        document.getElementsByClassName('imageFile')[0].click();
    }

    const uploadVideoFileWithClick = () => {
        document.getElementById('videoFile').click();
    }

    const handleUpload = async (event) => {
        event.preventDefault()
        if (!image[0] && !txt) {
            swal("Oops!", "Empty post!", "error");
        }
        else {
            if (video === '') {

                await db.collection("Feeds").doc(postId).update({
                    txt: txt,
                    img: image,
                });
            }
            else {

                await db.collection("Clips").doc(postId).update({
                    txt: txt,
                    video: video,
                });
            }

            swal("Updated!", "Your post has been updated!", "success");

            settxt("")
            setImage([]);
            setVideo('');
            props.closeModal();
            window.location.reload();
        }
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
                            //console.log(url);
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
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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

    function deleteVideo() {
        setVideo('');
        setImage([]);
    }

    function deleteImage(e) {
        const index = e.currentTarget.attributes.index.nodeValue;
        let array = image;
        array.splice(index, 1);
        setImage([...array]);
    }

    function Photo(cvalue, index) {

        return (
            <div key={index} className={style.imageContainer}>
                <img src={cvalue} alt="demo" width="80" height="60" />
                <CancelIcon fontSize="inherit" className={style.delete} index={index} onClick={deleteImage} />
            </div>
        );
    }

    function ImageGallery() {

        if (video !== '') {
            return (
                <div className={style.videoContainer}>
                    <video width="100" height="80">
                        <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                    <CancelIcon fontSize="inherit" className={style.delete} onClick={deleteVideo} />
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

    return (
        <div style={{borderRadius:"5px",border:"2px solid #DDDFE2"}}>
            <form>
                <div className={style.heading}>
                    <h3>Edit Post</h3>
                    <a href={props.closeModal} className={style.CrossIcon_edit}><ClearIcon onClick={props.closeModal} style={{padding:"5px",fontSize:"30px"}} /></a>
                    
                </div>
                <div className={style.main}>
                    <Avatar
                        className="imageupload__avatar"
                        alt={usN}
                        src={dp}
                    />
                    <h4 className={style.usN_editpost}>{usN}</h4>
                    
                </div>
                <textarea className={style.textInput} value={txt} onChange={(e) => settxt(e.target.value)}></textarea>

                
                <div className="imageuploadeditpost__feedModal">
                    <div className={style.buttons}>
                        <button type="submit" onClick={handleUpload} className={"btn " + style.submitButton}>Post</button>
                        
                    </div>
                </div>
            </form>
            <EditModal />
            <Progress />
        </div>
    );
}

export default Editpost;
