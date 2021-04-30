import React, { useState, useCallback, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { db, storage } from "../config/firebase.js";
import { checkUser } from "../Utilities/checkUser";
import firebase from "firebase";
import "./styles/Profile.css";
import FullViewclasses from "../Posts/styles/carouselpost.module.css";
import EditProfile from "./EditProfile";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PhoneIcon from "@material-ui/icons/Phone";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import Tooltip from "@material-ui/core/Tooltip";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CancelIcon from "@material-ui/icons/Cancel";
//import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import Grid from "./Grid";
import ProfileClips from "./ProfileClips";
import ReactCrop from "react-image-crop";
import Modal from "@material-ui/core/Modal";
import styles from "../Utilities/editimage.module.css";
import upvotefollowListClasses from "../Others/styles/upvoteFollowList.module.css";
import "react-image-crop/dist/ReactCrop.css";
import { upvotePujo } from "../Sidebars/UpvotePujoRow";
import UpvoteFollowList from "../Others/UpvoteFollowList";
import swal from "sweetalert";
import defaultcoverpic from "../images/cover.png";

import { RWebShare } from "react-web-share";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  EventNoteOutlined,
  GroupAddOutlined,
  HomeOutlined,
  ShareOutlined,
} from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

const pic =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function TabPanel(props) {
  const { value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    ></div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   indicator: {
//     backgroundColor: "purple",
//   },
// }));

const followPujo = (uid, userId, AddorRemove) => {
  const batch = db.batch();
  const user_ref = db.collection("Users").doc(uid);

  const username = localStorage.getItem("Username");
  const dp = localStorage.getItem("Dp");
  const type = localStorage.getItem("type");

  if (AddorRemove === "add") {
    const followers_ref = user_ref.collection("Followers").doc(userId);
    batch.update(user_ref, {
      follows: firebase.firestore.FieldValue.increment(1),
    });
    batch.set(followers_ref, {
      userID: uid,
      ts: Date.now(),
      uid: userId,
      type: type,
      username: username,
      userdp: dp,
    });
  } else if (AddorRemove === "remove") {
    batch.update(user_ref, {
      follows: firebase.firestore.FieldValue.increment(-1),
    });
    const followers_ref = user_ref.collection("Followers").doc(userId);
    batch.delete(followers_ref);
  }
  batch.commit();
};

function Profile(props) {
  //user is loged in user
  //uid is the uid of the user whose profile is to be shown
  const history = useHistory();

  const { id } = useParams();
  // const uid = history.location.state ? history.location.state.id : "";
  const uid = id;
  const userId = props.user.uid;

  const [value, setValue] = useState(0);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [contact, setContact] = useState("");
  const [profile_pic, setPic] = useState(pic);
  const [cover_pic, setCoverpic] = useState(defaultcoverpic);
  const [type, setType] = useState("");
  const [follows, setFollows] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [upvote_check, set_upvote_check] = useState(false);
  const [follow_check, set_follow_check] = useState(false);
  const [showUpvotersList, setShowUpvotersList] = useState(false);
  const [showFollowersList, setShowFollowersList] = useState(false);

  const [upImg, setUpImg] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [profilePicUpload, setProfilePicUpload] = useState(null);
  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [open, setOpen] = useState(false);
  const [viewImage, setViewImage] = useState("");

  useEffect(() => {
    function getData() {
      if (uid) {
        db.collection("Users")
          .doc(uid)
          .get()
          .then((doc) => {
            // console.log(doc.id, " => ", doc.data());
            const dt = doc.data();
            //console.log("k"+dt);

            setUsername(dt.name);
            setPincode(dt.pincode);
            setContact(dt.contact);
            setCity(dt.city);
            setState(dt.state);
            setAddress(dt.addressline);
            setContact(dt.contact);
            setPic(dt.dp);
            setType(dt.type);
            setFollows(dt.follows);
            setCoverpic(dt.coverpic);
            if (dt.type === "indi") {
              setAbout(dt.about);
              setGender(dt.gender);
            } else {
              setUpvotes(dt.upvotes);
              setAbout(dt.description);
              setCategory(dt.category);
            }
          });
      }
    }
    //console.log(userId);
    //console.log(uid);

    getData();
  }, [uid]);

  useEffect(() => {
    if (uid && type === "com") {
      db.collection("Users")
        .doc(uid)
        .collection("Upvoters")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) set_upvote_check(true);
        });
    }
  }, [uid, userId, type]);

  useEffect(() => {
    if (uid && type === "com") {
      db.collection("Users")
        .doc(uid)
        .collection("Followers")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) set_follow_check(true);
        });
    }
  }, [uid, userId, type]);

  if (checkUser(props.user) === false) history.replace("/login");

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
    const [crop, setCrop] = useState({
      unit: "%",
      width: 30,
      aspect: profilePicUpload ? 1 : 3,
    });
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
                  style={{
                    maxWidth: "60vw",
                    maxHeight: "60vh",
                    overflow: "scroll",
                  }}
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

  function Progress() {
    return (
      <Modal open={showProgress}>
        <div className={styles.progress}>
          <div className={styles.progressBarContainer}>
            <progress
              value={progress}
              max="100"
              className={styles.progressBar}
            />
            <p>Uploading...</p>
          </div>
        </div>
      </Modal>
    );
  }

  const FullscreenViewHandler = () => {
    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={FullViewclasses.fullViewContainer}>
          <CancelIcon
            className={FullViewclasses.closeFullView}
            onClick={() => setOpen(false)}
          />
          <TransformWrapper
            defaultScale={1}
            defaultPositionX={1}
            defaultPositionY={1}
          >
            {({ zoomIn, zoomOut, ...rest }) => (
              <>
                <TransformComponent>
                  <img
                    src={viewImage}
                    alt="fullviewImage"
                    className={FullViewclasses.fullViewImg}
                  />
                </TransformComponent>
                <div className={FullViewclasses.fullViewButtons}>
                  <span
                    onClick={zoomIn}
                    style={{
                      cursor: "pointer",
                      color: "white",
                      marginRight: "15px",
                    }}
                  >
                    <ZoomInIcon fontSize="large" />
                    <small>ZoomIn</small>
                  </span>
                  <span
                    onClick={zoomOut}
                    style={{ color: "white", cursor: "pointer" }}
                  >
                    <ZoomOutIcon fontSize="large" /> <small>ZoomOut</small>
                  </span>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      </Modal>
    );
  };

  function viewFullImage(imgsrc) {
    setViewImage(imgsrc);
    setOpen(true);
  }

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
            .then((url) => {
              if (profilePicUpload) updateprofilepicdata(url);
              else updatecoverpicdata(url);
              setShowProgress(false);
              setProfilePicUpload(null);
            });
        }
      );
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fname = e.target.files[0].name;
      if (
        fname.endsWith(".jpg") ||
        fname.endsWith(".jpeg") ||
        fname.endsWith(".png")
      ) {
        let name = e.target.files[0].name;
        name = name.substring(0, name.lastIndexOf(".")) + ".png";
        //console.log(name);
        startCrop(e.target.files[0]);
        setOpenEditModal(true);
        setFilename(name);
      } else {
        swal("Oops!", "Invalid format!", "error");
      }
    }
  };

  const uploadProfilePicture = (e) => {
    if (e.target.files[0]) {
      setProfilePicUpload(true);
      handleImageChange(e);
    }
  };

  const uploadCoverPicture = (e) => {
    if (e.target.files[0]) {
      setProfilePicUpload(false);
      handleImageChange(e);
    }
  };

  function changeProfilePicture() {
    const a = document.getElementById("profile-picture-file-input");
    a.value = "";
    a.click();
  }

  function changeCoverPicture() {
    const b = document.getElementById("cover-picture-file-input");
    b.value = "";
    b.click();
  }

  async function updateprofilepicdata(link) {
    setPic(link);
    localStorage.setItem("Dp", link);
    const ref = db.collection("Users").doc(uid);
    await ref.update({ dp: link });
  }

  async function updatecoverpicdata(link) {
    setCoverpic(link);
    const ref = db.collection("Users").doc(uid);
    await ref.update({ coverpic: link });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const EditProfileModal = () => {
    function closeModal() {
      setShowEditProfile(false);
    }

    return (
      <Modal open={showEditProfile}>
        <div className="editProfile-overlay">
          <div className="editProfile">
            <EditProfile
              uid={uid}
              name={username}
              type={type}
              about={about}
              city={city}
              state={state}
              pincode={pincode}
              address={address}
              gender={gender}
              category={category}
              contact={contact}
              close={closeModal}
            />
          </div>
        </div>
      </Modal>
    );
  };

  const upvoteClickHandler = () => {
    if (upvote_check) {
      upvotePujo(uid, userId, "remove");
    } else {
      upvotePujo(uid, userId, "add");
    }
    set_upvote_check(!upvote_check);
  };

  const followClickHandler = () => {
    if (follow_check) {
      followPujo(uid, userId, "remove");
    } else {
      followPujo(uid, userId, "add");
    }
    set_follow_check(!follow_check);
  };

  function openUpvoteListModal() {
    if (upvotes > 0) setShowUpvotersList(true);
  }

  function openFollowListModal() {
    if (follows > 0) setShowFollowersList(true);
  }

  if (props.user.length === 0) {
    return "";
  } else {
    return (
      <>
        <span onClick={() => history.goBack()} className="back-btn">
          <ArrowBackIcon />
        </span>
        <div className="container-fluid profile">
          <div className="container profile-display">
            <div className="profile-display__cover">
              <img
                src={cover_pic}
                alt="cover"
                id="coverPicture"
                className="profile-display__cover-img"
                onClick={() => viewFullImage(cover_pic)}
              />
              <input
                type="file"
                accept="image/*"
                id="cover-picture-file-input"
                hidden="hidden"
                onChange={uploadCoverPicture}
              />
              {userId === uid ? (
                <Tooltip title="Edit Cover picture" placement="bottom">
                  <button
                    className="btn btn-sm  profile-display__cover-edit"
                    onClick={changeCoverPicture}
                  >
                    {/* <span>Edit picture</span> */}
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                </Tooltip>
              ) : null}
            </div>
            <div className="profile-display__about">
              <div className="profile-display__about--imgC">
                <img
                  src={profile_pic}
                  alt="profile"
                  className="profile-display__about--img"
                  onClick={() => viewFullImage(profile_pic)}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="profile-picture-file-input"
                  hidden="hidden"
                  onChange={uploadProfilePicture}
                />
                {userId === uid ? (
                  <Tooltip title="Edit Profile Picture" placement="right">
                    <button
                      className="btn profile-display__about--img-edit"
                      onClick={changeProfilePicture}
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>
                ) : null}
              </div>
              {userId === uid ? (
                <Tooltip title="Edit Profile" placement="right">
                  <button
                    className="btn profile-display__about--profile-edit"
                    onClick={() => setShowEditProfile(true)}
                  >
                    Edit Profile
                    <EditOutlinedIcon />
                  </button>
                </Tooltip>
              ) : null}

              <div className="profile-display__about-user">
                <div className="profile-display__about-user--name">
                  {username}
                </div>
                <div className="profile-display__about-user--all">
                  <HomeOutlined />
                  {`${address}, ${state}`}
                </div>
                {about !== "" ? (
                  <div className="profile-display__about-user--all">
                    <EventNoteOutlined />
                    {about}
                  </div>
                ) : null}
                {/* <div className="profile-display__about-user--all">
                  {address}
                </div> */}
                <div className="profile-display__about-user--all">
                  <PhoneIcon />
                  {contact}
                </div>
                <div className="group-span">
                  {follows > 0 ? (
                    <div
                      className="profile-display__about-user--span"
                      onClick={openFollowListModal}
                    >
                      <GroupAddOutlined />
                      &nbsp;{follows} Followers{" "}
                    </div>
                  ) : null}
                  {type === "com" && upvotes > 0 ? (
                    <div
                      className="profile-display__about-user--span"
                      onClick={openUpvoteListModal}
                    >
                      <ThumbUpIcon />
                      {upvotes + "  "}people upvoted this
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="profile-display__about-com">
                {type === "com" && userId !== uid ? (
                  <>
                    <div className="profile-display__about-com--part">
                      <button
                        className="btn btn-upvote-profile"
                        onClick={upvoteClickHandler}
                      >
                        {upvote_check ? (
                          <HowToVoteIcon
                            style={{
                              marginBottom: "2px",
                              paddingRight: "4px",
                            }}
                          />
                        ) : null}
                        {upvote_check ? " Upvoted" : "Upvote"}
                      </button>
                    </div>
                    <div className="profile-display__about-com--part">
                      <button className="btn btn-locate-profile">
                        <LocationOnIcon
                          style={{ marginBottom: "2px", paddingRight: "4px" }}
                        />
                        Locate
                      </button>
                    </div>
                  </>
                ) : null}
                {userId !== uid ? (
                  <div className="profile-display__about-com--part">
                    <button
                      className="btn btn-follow-profile"
                      onClick={followClickHandler}
                    >
                      {follow_check ? (
                        <DoneAllIcon
                          style={{ marginBottom: "2px", paddingRight: "4px" }}
                        />
                      ) : null}
                      {follow_check ? "  Following" : "Follow"}
                    </button>
                  </div>
                ) : null}
              </div>
              <RWebShare
                data={{
                  text: "Check out the profile on Utsav!",
                  url: window.location.href,
                  title: "Utsav",
                }}
                className="profile-display__about--share"
              >
                <button className="btn profile-display__about--share">
                  <ShareOutlined />
                </button>
              </RWebShare>
            </div>
          </div>
          <div className="container profile-tabs">
            <div>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                <Tab
                  label="POSTS"
                  {...a11yProps(0)}
                  style={{ outline: "none" }}
                />
                <Tab
                  label="CLIPS"
                  {...a11yProps(1)}
                  style={{ outline: "none" }}
                />
              </Tabs>
            </div>
            <TabPanel value={value} index={0}>
              <Grid userId={uid} username={username} dp={profile_pic} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ProfileClips userId={userId} uid={uid} />
            </TabPanel>
          </div>
        </div>
        <FullscreenViewHandler src={viewImage} />
        <EditModal />
        <Progress />
        <EditProfileModal />
        {type === "com" ? (
          <Modal open={showUpvotersList}>
            <div className={upvotefollowListClasses.main}>
              <div>
                <div className={upvotefollowListClasses.heading}>
                  <h6>Upvoters</h6>
                  <CancelIcon
                    className={upvotefollowListClasses.closeBtn}
                    onClick={() => setShowUpvotersList(false)}
                  />
                </div>
                <UpvoteFollowList for="upvote" userid={uid} />
              </div>
            </div>
          </Modal>
        ) : null}
        <Modal open={showFollowersList}>
          <div className={upvotefollowListClasses.main}>
            <div>
              <div className={upvotefollowListClasses.heading}>
                <h6>Followers</h6>
                <CancelIcon
                  className={upvotefollowListClasses.closeBtn}
                  onClick={() => setShowFollowersList(false)}
                />
              </div>
              <UpvoteFollowList for="follow" userid={uid} />
            </div>
          </div>
        </Modal>
      </>
      // <>

      //       <div className="profile">
      //         <div className="profile-picture">

      //           <div className="profile-name">
      //
      //
      //           </div>
      //         </div>
      //       </div>
      //       <hr />
      //       <div className="details">
      //         <h5>About</h5>
      //
      //         <h6>Address : </h6>
      //

      //       <hr />
      //
      //     </div>
      //   </div>
      // </>
    );
  }
}

export default Profile;
