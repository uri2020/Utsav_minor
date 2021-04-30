import React, { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { db } from "../config/firebase.js";
import swal from "sweetalert";

import states from "../data/states";
import { Close } from "@material-ui/icons";

function option_state(currentvalue) {
  return (
    <option key={currentvalue.id} value={currentvalue.name}>
      {currentvalue.name}
    </option>
  );
}

function EditProfile(props) {
  const uid = props.uid;
  const [name, setName] = useState(props.name);
  const type = props.type;
  const [gender, setGender] = useState(props.gender); // for indi only
  const [category, setCategory] = useState(props.category); // for com only
  const [about, setAbout] = useState(props.about); // for indi only
  const [addressline, setAddress] = useState(props.address);
  const [city, setCity] = useState(props.city);
  const [pincode, setPincode] = useState(props.pincode);
  const [contact, setContact] = useState(props.contact);
  const [state, setState] = useState(props.state);
  const [small_city, setSmallCity] = useState(props.city.toLowerCase());
  const [small_state, setSmallState] = useState(props.state.toLowerCase());
  const [small_name, setSmallName] = useState(props.name.toLowerCase());

  const submitHandler = (e) => {
    e.preventDefault();

    if (type === "indi") {
      db.collection("Users")
        .doc(uid)
        .update({
          name: name,
          gender: gender,
          about: about,
          addressline: addressline,
          city: city,
          pincode: pincode,
          contact: contact,
          state: state,
          small_city: small_city,
          small_name: small_name,
          small_state: small_state,
        })
        .then(function () {
          swal("Done!", "The Profile has been reported!", "success").then(() =>
            window.location.reload()
          );
          props.close();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      db.collection("Users")
        .doc(uid)
        .update({
          name: name,
          category: category,
          description: about,
          addressline: addressline,
          city: city,
          pincode: pincode,
          contact: contact,
          state: state,
          small_city: small_city,
          small_name: small_name,
          small_state: small_state,
        })
        .then(function () {
          swal("Done!", "The Profile has been reported!", "success");
          props.close();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };

  return (
    <form className="editProfile__form">
      <header className="editProfile__header">
        <div className="editProfile__header--head">Edit Profile</div>
        <Close className="editProfile_closebtn" onClick={props.close} />
      </header>

      <div className="editProfile-wrap">
        <div className="editProfile__group">
          <label htmlFor="name" className="editProfile__group--label">
            {type === "indi" ? "Name" : "Committee Name :"}
          </label>
          <input
            className="editProfile__group--input"
            placeholder={type === "indi" ? "Name" : "Committee Name"}
            value={name}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
              setSmallName(e.target.value.toLowerCase());
            }}
            id="name"
            required
          />
        </div>
        {type === "indi" ? (
          <div className="editProfile__group">
            <label className="editProfile__group--label">Gender</label>
            <div className="editProfile__group-radio">
              <div className="editProfile__group-radio--part">
                <input
                  className="editProfile__group-radio--input"
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  id="gender-male"
                  required
                />
                <label
                  htmlFor="gender-male"
                  className="editProfile__group-radio--label"
                >
                  Male
                </label>
              </div>
              <div className="editProfile__group-radio--part">
                <input
                  className="editProfile__group-radio--input"
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  id="gender-female"
                />
                <label
                  htmlFor="gender-female"
                  className="editProfile__group-radio--label"
                >
                  Female
                </label>
              </div>
              <div className="editProfile__group-radio--part">
                <input
                  className="editProfile__group-radio--input"
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  id="gender-other"
                />
                <label
                  htmlFor="gender-other"
                  className="editProfile__group-radio--label"
                >
                  Other
                </label>
              </div>
            </div>
          </div>
        ) : null}
        <div className="editProfile__group">
          <label htmlFor="about" className="editProfile__group--label">
            {type === "indi" ? "About you" : "Description"}
          </label>
          <textarea
            className="editProfile__group--textarea"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            cols="8"
            id="about"
          ></textarea>
        </div>
        <div className="editProfile__group">
          <label htmlFor="state" className="editProfile__group--label">
            State{" "}
          </label>
          <select
            className="editProfile__group--select"
            name="state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setSmallState(e.target.value.toLowerCase());
            }}
            id="state"
          >
            <option className="editProfile__group--option" value="">
              Choose State
            </option>
            {states.map(option_state)}
          </select>
        </div>
        <div className="editProfile__group">
          <label htmlFor="addressline" className="editProfile__group--label">
            Address
          </label>
          <input
            className="editProfile__group--input"
            type="text"
            placeholder="Address line"
            value={addressline}
            onChange={(e) => setAddress(e.target.value)}
            id="addressline"
            required
          />
          <div className="editProfile__group--address">
            <div className="editProfile__group">
              <label htmlFor="city" className="editProfile__group--label">
                City
              </label>
              <input
                className="editProfile__group--input"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setSmallCity(e.target.value.toLowerCase());
                }}
                placeholder="City/District"
                id="city"
                required
              />
            </div>
            <div className="editProfile__group">
              <label htmlFor="pincode" className="editProfile__group--label">
                Pincode
              </label>
              <input
                className="editProfile__group--input"
                placeholder="Pincode"
                name="pincode"
                value={pincode}
                type="text"
                onChange={(e) => setPincode(e.target.value)}
                id="pincode"
              />
            </div>
          </div>
        </div>
        <div className="editProfile__group">
          <label htmlFor="contact" className="editProfile__group--label">
            Contact
          </label>
          <input
            className="editProfile__group--input"
            placeholder="Contact"
            value={contact}
            pattern="[0-9]{12}"
            maxLength="13"
            type="tel"
            onChange={(e) => setContact(e.target.value)}
            required
            id="contact"
          />
        </div>
        {type === "com" ? (
          <div className="editProfile__group">
            <label className="editProfile__group--label">Select Category</label>
            <div className="editProfile__group-radio">
              <div className="editProfile__group--radio-wrap">
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Sarbojonin"
                    checked={category === "Sarbojonin"}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    id="sarbojonin"
                  />
                  <label
                    className="editProfile__group-radio--label"
                    htmlFor="sarbojonin"
                  >
                    Sarbojonin
                  </label>
                </div>
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Bonedi Bari"
                    checked={category === "Bonedi Bari"}
                    onChange={(e) => setCategory(e.target.value)}
                    id="bonedibari"
                  />
                  <label
                    htmlFor="bonedibari"
                    className="editProfile__group-radio--label"
                  >
                    Bonedi Bari
                  </label>
                </div>
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Housing Complex"
                    checked={category === "Housing Complex"}
                    onChange={(e) => setCategory(e.target.value)}
                    id="housingcomplex"
                  />
                  <label
                    htmlFor="housingcomplex"
                    className="editProfile__group-radio--label"
                  >
                    Housing Complex
                  </label>
                </div>
              </div>
              <div className="editProfile__group--radio-wrap">
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Math/ Mission"
                    checked={category === "Math/ Mission"}
                    onChange={(e) => setCategory(e.target.value)}
                    id="mathmission"
                  />
                  <label
                    htmlFor="mathmission"
                    className="editProfile__group-radio--label"
                  >
                    Math / Mission
                  </label>
                </div>
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Prabashi"
                    checked={category === "Prabashi"}
                    onChange={(e) => setCategory(e.target.value)}
                    id="prabashi"
                  />
                  <label
                    htmlFor="prabashi"
                    className="editProfile__group-radio--label"
                  >
                    Prabashi
                  </label>
                </div>
                <div className="editProfile__group--radio-wrap--group">
                  <input
                    className="editProfile__group-radio--input"
                    type="radio"
                    name="category"
                    value="Others"
                    checked={category === "Others"}
                    onChange={(e) => setCategory(e.target.value)}
                    id="others"
                  />
                  <label
                    htmlFor="others"
                    className="editProfile__group-radio--label"
                  >
                    Others
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          onClick={submitHandler}
          className="btn btn-outline-success btn-editProfile"
        >
          Update
        </button>
      </div>
    </form>
  );
}

export default EditProfile;
