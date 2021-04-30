import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./styles/pujoregister.css";
import { storage, db } from "../config/firebase.js";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import styles from "../Utilities/editimage.module.css";
import swal from "sweetalert";
import logo from "../images/logo.png";
import cities from "../data/cities";

import states from "../data/states";
import { useHistory } from "react-router";

function option_state(currentvalue) {
  return (
    <option key={currentvalue.id} value={currentvalue.name}>
      {currentvalue.name}
    </option>
  );
}
function option_city(currentvalue) {
  return (
    <option key={currentvalue.id} value={currentvalue.name}>
      {currentvalue.name}
    </option>
  );
}
// function option_city(currentvalue) {
//     return (
//         <option key={currentvalue.id} value={currentvalue.name}>{currentvalue.name}</option>
//     );
// }
function PujoRegister(props) {
  const history = useHistory();
  const googleSignin =
    history.location.state === undefined || history.location.state === null
      ? null
      : history.location.state.googleSignin;

  const [name, setName] = useState("");
  const type = "com";
  const email = props.user.email;
  const [category, setCategory] = useState();
  const [description, setDescription] = useState("");
  const [addressline, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState("");
  const [dp, setDp] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const coverpic =
    "https://firebasestorage.googleapis.com/v0/b/utsav-def1e.appspot.com/o/images%2Fcover.png?alt=media&token=ff48d550-0bb4-4b52-90c2-faf0fe72282d";
  const [small_city, setSmallCity] = useState("");
  const [small_state, setSmallState] = useState("");
  const [small_name, setSmallName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [upImg, setUpImg] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

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
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 });
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
              setDp(url);
              setShowProgress(false);
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

  const handleEditPicture = () => {
    const fileInput = document.getElementById("input");
    fileInput.value = "";
    fileInput.click();
  };

  const submitHandler = (e) => {
    e.preventDefault();

    db.collection("Users")
      .doc(props.user.uid)
      .set({
        name: name,
        email: email,
        category: category,
        description: description,
        addressline: addressline,
        city: city,
        pincode: pincode,
        contact: contact,
        state: state,
        dp: dp,
        coverpic: coverpic,
        type: type,
        upvotes: 0,
        follows: 0,
        small_city: small_city,
        small_name: small_name,
        small_state: small_state,
        visits: 0,
        lastVisitTime: null,
      })
      .then(function () {
        history.replace({
          pathname: "/",
          state: { googleSignin: googleSignin },
        });
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <div className="pujo-register">
      <div id="pujo_register_label"></div>
      <div className="container">
        <div className="row">
          <div
            className="prn_form"
            data-aos="fade-in"
            style={{ marginBottom: "40px" }}
          >
            <div id="pr_form_inside">
              <div id="pr_form_head_logo">
                <img src={logo} id="pform_logo" alt="form-logo" />
                <div id="pform_name">
                  <p id="pform_logo_name">Utsav</p>
                  <p id="pr_explore_line">Let's Explore more of India</p>
                </div>
              </div>
              <form
                onSubmit={submitHandler}
                className="community-register-form"
              >
                <br />
                <div id="pform_main">
                  <div id="pform_fl_right">
                    <div className="prn_img-holder">
                      <img src={dp} alt="" id="img" className="pr_img" />
                    </div>
                    <input
                      className="input-outline-disable"
                      type="file"
                      accept="image/*"
                      name="image-upload"
                      id="input"
                      hidden="hidden"
                      onChange={handleChange}
                    />
                    <center id="prform_tool">
                      {" "}
                      <Tooltip title="Edit profile picture" placement="top">
                        <IconButton onClick={handleEditPicture} className="">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </center>
                  </div>
                  <div id="pform_fl_left">
                    <p id="pform_title">Pujo Registration</p>
                    <input
                      placeholder="Committee Name"
                      value={name}
                      type="text"
                      onChange={(e) => {
                        setName(e.target.value);
                        setSmallName(e.target.value.toLowerCase());
                      }}
                      id="name"
                      className="pform_fname input-outline-disable"
                      required
                    />

                    <input
                      placeholder={email}
                      readOnly={true}
                      className="prform_femail input-outline-disable"
                    />

                    <br />
                    <textarea
                      name="description"
                      value={description}
                      className="pform_fabout"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about yourself."
                    ></textarea>
                    <br />
                    <div id="pform_div_fstate">
                      <select
                        name="state"
                        value={state}
                        className="pform_fstate"
                        onChange={(e) => {
                          setState(e.target.value);
                          setSmallState(e.target.value.toLowerCase());
                        }}
                      >
                        <option value="" id="pr_optional" disabled selected>
                          Choose State
                        </option>
                        {states.map(option_state)}
                      </select>
                    </div>

                    <div id="pform_div_fcity">
                      <select
                        name="city"
                        className="pform_fcity"
                        onChange={(e) => {
                          setCity(e.target.value);
                          setSmallCity(e.target.value.toLowerCase());
                          console.log(e.target.value);
                        }}
                        required
                      >
                        <input
                          className="input-outline-disable"
                          type="text"
                          placeholder="Choose city"
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                          }}
                        />
                        {/* <option value="">City</option> */}
                        <option value="" id="pr_optional" disabled selected>
                          Choose City
                        </option>
                        {cities
                          .filter((val) => {
                            if (searchTerm == "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            ) {
                              return val;
                            }
                          })
                          .map(option_city)}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Address line"
                      value={addressline}
                      className="pform_faddress input-outline-disable"
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />

                    <input
                      placeholder="Pincode"
                      name="pincode"
                      value={pincode}
                      className="pform_fpin input-outline-disable"
                      type="text"
                      onChange={(e) => setPincode(e.target.value)}
                      id="pincode"
                    />
                    <input
                      placeholder="Contact Number"
                      className="pform_fcontact input-outline-disable"
                      value={contact}
                      type="text"
                      onChange={(e) => setContact(e.target.value)}
                      required
                    />
                    <div id="prn_form_register">
                      <b id="prn_bold">Select Category : </b>
                      <div className="prn_register__radiocontainer">
                        <div id="radio_container_left">
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Sarbojonin"
                              onChange={(e) => setCategory(e.target.value)}
                              required
                            />{" "}
                            Sarbojonin{" "}
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Bonedi Bari"
                              onChange={(e) => setCategory(e.target.value)}
                            />{" "}
                            Bonedi Bari{" "}
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Housing Complex"
                              onChange={(e) => setCategory(e.target.value)}
                            />{" "}
                            Housing Complex{" "}
                          </div>
                        </div>
                        <div id="radio_container_right">
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Math/ Mission"
                              onChange={(e) => setCategory(e.target.value)}
                            />{" "}
                            Math/ Mission{" "}
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Prabashi"
                              onChange={(e) => setCategory(e.target.value)}
                            />{" "}
                            Prabashi{" "}
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="category"
                              value="Others"
                              onChange={(e) => setCategory(e.target.value)}
                            />{" "}
                            Others{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="prn_button_form">
                    <button
                      type="submit"
                      className="btn btn-outline-success pform_fbutton"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <EditModal />
      <Progress />
    </div>
  );
}

export default PujoRegister;
