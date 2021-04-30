import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "../Utilities/editimage.module.css";
import "./styles/ImageUpload.css";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { storage, db } from "../config/firebase.js";
import { useHistory } from "react-router-dom";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CancelIcon from "@material-ui/icons/Cancel";
// import PhotoLibraryIcon from '../images/gallery_icon.png';
import swal from "sweetalert";
import Translate from "../Translate/Translate";
import ClearIcon from "@material-ui/icons/Clear";
import createIcon from "../images/create_pen.png";
import galleryIcon from "../images/gallery_icon.png";
import photoIcon from "../images/camera_icon.png";
import recorderIcon from "../images/recorder_icon.png";

function getModalStyle() {
  const top = 40;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #DDDFE2",
    outline: "none",
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    maxWidth: "500px",
  },
}));

function ImageUpload({ usN, dp, uid, type, lang }) {
  const classes = useStyles();
  const history = useHistory("");
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState("");
  const [txt, settxt] = useState("");
  const [htmlContent, setHtmlContent] = useState();
  const [tagList, setTagList] = useState([]);
  const [progress, setProgress] = useState(0);

  const [upImg, setUpImg] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [filename, setFilename] = useState("");

  const startCrop = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(file);
    }
  };

  function EditModal() {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 4 / 3 });
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
      const ctx = canvas.getContext("2d");
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

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
        <Modal open={openEditModal}>
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
                  <button
                    className="btn btn-warning ml-4"
                    onClick={() => setOpenEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.canvas}>
              <canvas
                ref={previewCanvasRef}
                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                style={{
                  width: Math.round(completedCrop?.width ?? 0),
                  height: Math.round(completedCrop?.height ?? 0),
                }}
              />
            </div>
          </>
        </Modal>
      </>
    );
  }

  const uploadFileWithClick = () => {
    document.getElementsByClassName("imageFile")[0].click();
  };

  const uploadVideoFileWithClick = () => {
    document.getElementById("videoFile").click();
  };

  const handleOpen = () => {
    if (window.innerWidth > 750) setOpen(true);
    else history.push("/createpost");
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if ((image[0] === "" || video === "") && txt === "") {
      swal("Oops!", "Empty post!", "error");
    } else {
      setOpen(false);
      if (video === "") {
        db.collection("Feeds").add({
          ts: Date.now(),
          txt: txt,
          tagList: tagList,
          img: image,
          likecount: 0,
          reportcount: 0,
          cmtNo: 0,
          uid: uid,
          type: type,
          username: usN,
          userdp: dp,
        });
      } else {
        db.collection("Clips").add({
          ts: Date.now(),
          txt: txt,
          tagList: tagList,
          video: video,
          likecount: 0,
          cmtNo: 0,
          uid: uid,
          type: type,
          username: usN,
          userdp: dp,
        });
      }

      settxt("");
      setImage([]);
      setTagList([]);
      setVideo("");
    }
  };

  function getImageData(canvas, fileName) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }

  const handleImageUpload = async (canvas) => {
    const file = await getImageData(canvas, filename);

    if (filename && file) {
      const uploadTask = storage.ref(`images/${filename}`).put(file);
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
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then((url) => {
              prog.style.display = "none";
              setImage([...image, url]);
              //console.log(url);
            });
        }
      );
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fname = e.target.files[0].name;
      if (
        fname.endsWith(".jpg") ||
        fname.endsWith(".jpeg") ||
        fname.endsWith(".png")
      ) {
        if (image.length > 9) {
          swal("Oops!", "You can have maximum 10 photos in post!", "error");
        } else {
          let name = e.target.files[0].name;
          name = name.substring(0, name.lastIndexOf(".")) + ".png";
          //console.log(name);
          startCrop(e.target.files[0]);
          setOpenEditModal(true);
          setFilename(name);
        }
      } else {
        swal("Oops!", "Invalid format!", "error");
      }
    }
  };

  function handleVideoInputChange(e) {
    if (e.target.files[0]) {
      const filename = e.target.files[0].name;
      if (filename.endsWith(".mp4")) {
        const uploadTask = storage
          .ref(`videos/${e.target.files[0].name}`)
          .put(e.target.files[0]);
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
              .then((url) => {
                prog.style.display = "none";
                setVideo(url);
              });
          }
        );
      } else {
        swal("Oops!", "Invalid format!", "error");
      }
    }
  }

  function deleteVideo() {
    setVideo("");
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
        <CancelIcon
          fontSize="inherit"
          className="delete"
          index={index}
          onClick={deleteImage}
        />
      </div>
    );
  }

  function ImageGallery() {
    if (video !== "") {
      return (
        <div className="videoContainer">
          <video width="100px" height="80px">
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <CancelIcon
            fontSize="inherit"
            className="delete"
            onClick={deleteVideo}
          />
        </div>
      );
    }
    if (image !== "") {
      return <>{image.map(Photo)}</>;
    } else {
      return "";
    }
  }

  // yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
  var ua = window.navigator.userAgent.toLowerCase();
  var isIE = !!ua.match(/msie|trident\/7|edge/);
  var isWinPhone = ua.indexOf('windows phone') !== -1;
  var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);

  function fixIOS() {
    var $highlights = document.getElementsByClassName("highlights");
    // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
    $highlights.css({
      'padding-left': '+=3px',
      'padding-right': '+=3px'
    });
  }

  if (isIOS) {
    fixIOS();
  }

  function showtags(cvalue, index) {
    return (
      <span key={index.toString()} style={{ color: '#4080FF' }}>
        {"#" + cvalue + " "}
      </span>
    );
  }

  function handleScroll(e) {
    const y = e.target.scrollTop;
    const el = document.getElementsByClassName('highlights')[0];
    el.scrollTop = y;
  }

  function applyHighlights(text) {
    text = text
      .replace(/#\w+/g, '<mark>$&</mark>');

    if (isIE) {
      // IE wraps whitespace differently in a div vs textarea, this fixes it
      text = text.replace(/ /g, ' <wbr>');
    }

    return text;
  }

  function handleInput(e) {
    const text = e.target.value;
    const div = document.getElementById("highlight");
    settxt(text);

    const highlightedText = applyHighlights(text);
    //console.log("highlightedText=> ", highlightedText);
    //div.innerHTML = highlightedText;
    setHtmlContent(highlightedText);

    let array = text.match(/#\w+/g);
    if (array) {
      const list = array.map((item) => {
        return item.substring(1);
      });
      setTagList(list);
    }
    else
      setTagList([]);
  }


  return (
    <div className="imageupload">

      {openEditModal ? <EditModal /> :
        <Modal
          open={open}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="imageupload__commentAssign">
              <div className="imageupload__firstSectionModal">
                <h3><Translate lang={lang}>Create Post</Translate></h3>
                <a href={handleClose} id="CrossIcon_create"><ClearIcon onClick={handleClose}  style={{padding:"5px",fontSize:"30px"}}/></a>
              </div>
              <div className="imageupload__secondSectionModal">
                <div id="imageuploadAvatar_cancel">
                  <Avatar
                    className="imageupload__avatar"
                    alt={usN}
                    src={dp}
                  />
                  <h4>{usN}</h4></div>
                {/* <div style={{ padding: '3px 5px' }}>{tagList.map(showtags)}</div> */}
                <div className="backdrop">
                  <div className="highlightedText" id="highlight" dangerouslySetInnerHTML={{ __html: htmlContent }}>
                  </div>
                  <textarea
                    className="textInput"
                    type="text" value={txt} onChange={handleInput} onScroll={handleScroll}
                    placeholder={`What's on your mind ${usN} ?`}>
                  </textarea>
                </div>

              </div>

              <div className="postUploadOptions">
                <div className="imageupload__imageuploadModal" onClick={uploadFileWithClick} id="imageUploadField">
                  <img src={galleryIcon} style={{width:"25px"}}/>
                  <input type="file" className="imageFile" onChange={handleChange} accept=".jpg, .jpeg, .png, .gif" />
                  <h3><Translate lang={lang}>Photos</Translate></h3>
                </div>
                <div className="imageupload__imageuploadModal" id="videoUploadField" onClick={uploadVideoFileWithClick}>
                <img src={recorderIcon} style={{width:"30px"}} />
                  <input type="file" id="videoFile" onChange={handleVideoInputChange} accept=".mp4" />
                  <h3><Translate lang={lang}>Video</Translate></h3>
                </div>

              </div>
              <br />
              <div className="imageupload__feedModal">
                <progress value={progress} max="100" className="progress_post_upload" id="progress" />
                <div className="imageGallery">
                  <ImageGallery />
                </div>

                <Button type="submit" onClick={handleUpload} className="imageupload__submitButton">Post</Button>
              </div>
            </form>
          </div>
        </Modal>
      }
      <div className="imageupload__container">
        {/* <div className="imageupload__firstSection">
                    <h3>Create Post</h3>
                    </div> */}

        <div className="imageupload__secondSection">
          <Avatar className="imageupload__avatar" alt={usN} src={dp} />
          <input
            type="text"
            onClick={handleOpen}
            placeholder={`What's on your mind ${usN} ?`}
            id="imageupload_secondinput"
          />
        </div>

        <div className="uploadimage__options" onClick={setOpen}>
          <div className="imageupload__imageupload">
            <img
              src={photoIcon}
              className="imageupload__gallery"
              alt=""
            ></img>
            <h3>
              <Translate lang={lang}>Camera</Translate>
            </h3>
          </div>
          <div className="imageupload__imageupload">
            <img
                src={recorderIcon}
              className="imageupload__gallery"
              alt=""
            ></img>
            <h3>
              <Translate lang={lang}>Recorder</Translate>
            </h3>
          </div>
          <div className="imageupload__imageupload">
            <img
                src={galleryIcon}
              className="imageupload__gallery"
              alt=""
            ></img>
            <h3>
              <Translate lang={lang}>Gallery</Translate>
            </h3>
          </div>
          <div className="imageupload__imageupload">
            <img
              src={createIcon}
              className="imageupload__gallery"
              alt=""
            ></img>
            <h3>
              <Translate lang={lang}>Create</Translate>
            </h3>
          </div>
          {/* <div className="imageupload__more">

                        <img src="https://image.flaticon.com/icons/svg/860/860760.svg" className="imageupload__dots" alt="" />
                    </div> */}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
