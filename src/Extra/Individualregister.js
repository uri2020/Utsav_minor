
//import 'bootstrap-css-only/css/bootstrap.min.css';
//import mdb from 'mdbreact/dist/css/mdb.css';

import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCardHeader, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import { db, storage } from '../firebase.js';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import logo from './images/logo2.jpg';
import './styles/individualregister.css';

import states from "./data/states";

class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: this.props.user.email,
      gender: '',
      about: '',
      addressline: '',
      city: '',
      pincode: '',
      contact: '',
      state: '',
      dp: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      coverpic: 'https://firebasestorage.googleapis.com/v0/b/utsav-def1e.appspot.com/o/images%2Fcover.png?alt=media&token=ff48d550-0bb4-4b52-90c2-faf0fe72282d',
      type: '',
      small_city: '',
      small_name: '',
      small_state: '',
      uid: ''

    }


    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ dp: reader.result })
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("input");
    fileInput.click();
  }

  handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image.image.name);
    this.props.uploadImage(formData);
  };

  //  uploadImage = (formData)=>(dispatch) =>{
  //    dispatch({ type:LOADING_USER});
  //    axios.post('/user/image',formData)
  //    .then(() =>{
  //      dispatch(getUserData());
  //    })
  //    .catch(err =>console.log(err));
  //  }

  changeHandler = e => {

    this.setState({ [e.target.name]: e.target.value })

  }

  submitHandler = e => {
    e.preventDefault()
    // console.log(this.state)

    // exports.addDocIdToField = 

    // functions.firestore.document('User/{docID}').onCreate((snap,context) => {
    //     const uid = context.params.docID;
    //     return admin.firestore().collection('User')
    //         .doc(uid).set({ uid: snap.uid }, { merge: true })
    //         .then(() => {
    //             return null;
    //         })
    //         .catch((error) => {
    //             return null;
    //         });
    // }) 

    db.collection("Users")
      .add({
        name: this.state.name,
        email: this.state.email,
        gender: this.state.gender,
        about: this.state.about,
        addressline: this.state.addressline,
        city: this.state.city,
        pincode: this.state.pincode,
        contact: this.state.contact,
        state: this.state.state,
        dp: this.state.dp,
        coverpic: this.state.coverpic,
        type: this.state.type,
        small_city: this.state.city.toLowerCase(),
        small_name: this.state.name.toLowerCase(),
        small_state: this.state.state.toLowerCase(),

      })
      .then(function () {
        alert("Document successfully written👍");
        window.location.replace("/");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });


  }

  option_state(currentvalue) {
    return (
      <option key={currentvalue.id} value={currentvalue.name}>{currentvalue.name}</option>
    );
  }

  render() {
    const { name, email, gender, about, addressline, city, pincode, contact, state, dp, type } = this.state;
    return (
      <div className="individual-register" >
        <MDBContainer>

          <MDBRow>
            <MDBCol lg="3" md="4" >
              <div className="individual-register-heading" data-aos="fade-right">
                  <img src={logo} alt="logo" className="individual-register-logo" />
              </div>
            </MDBCol>

            <MDBCol lg="1" md="1">
              <br />
            </MDBCol>

            <MDBCol lg="6" md="7" data-aos="fade-left">
              <MDBCard wide>
                <MDBCardBody>
                  <MDBCardHeader className="">
                    <h3 className="my-3 user-registeration">
                      <b><i>USER REGISTRATION</i></b>
                    </h3>
                  </MDBCardHeader>
                  <form onSubmit={this.submitHandler} className="individual-register-form">
                    <br></br>

                    <div className="img-holder">
                      <img src={dp} alt="" id="img" className="img" />
                    </div>
                    <input type="file" accept="image/*" name="image-upload" id="input" hidden="hidden" onChange={this.imageHandler} />
                    <center> <Tooltip title="Edit profile picture" placement="top">
                      <IconButton onClick={this.handleEditPicture} className="">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    </center>

                    <div className="">
                      <MDBInput
                        label="Name"
                        name="name"
                        value={name}
                        group
                        type="text"
                        onChange={this.changeHandler}
                        validate
                        error="wrong"
                        success="right"
                      />
                      <MDBInput
                        label="Email"
                        name="email"
                        value={email}
                        group
                        type="email"
                        validate
                        error="wrong"
                        success="right"
                      />

                      <label style={{ marginRight: "5px" }}>Type : </label>
                      <select name="type" value={type} onChange={this.changeHandler} id="type">
                        <option value="Community">Choose type</option>
                        <option value="Community">Community</option>
                        <option value="Individual">Individual</option>

                      </select>

                      <div className="form-group" style={{ marginBottom: '5px' }}>
                        <label>Gender : </label><br />
                        <div className="register__radiocontainer">
                          <span>
                            <input type="radio" name="gender" value="Male" onChange={this.changeHandler} />
                            <label style={{ marginLeft: 4 }}>Male</label>
                          </span>
                          <span>
                            <input type="radio" name="gender" value="Female" onChange={this.changeHandler} />
                            <label style={{ marginLeft: 4 }}>Female</label>
                          </span>
                          <span>
                            <input type="radio" name="gender" value="Other" onChange={this.changeHandler} />
                            <label style={{ marginLeft: 4 }}>Other</label>
                          </span>
                        </div>
                      </div>

                      {/* <MDBIcon icon="city" /><label for="gender">Gender</label> 
                   <select  name="gender" value={gender} onChange={this.changeHandler} id="gender">
                   <option value="gender">Choose Gender</option>
                    <option value="male">Male</option>
                   <option value="female">Female</option>
                       </select> */}

                      <MDBInput
                        label="About You"
                        group
                        type="textarea"
                        name="about"
                        value={about}
                        onChange={this.changeHandler}
                        validate
                        error="wrong"
                        success="right"
                        placeholder="About"
                      />

                      <label style={{ marginRight: "5px" }} >State : </label>
                      <select name="state" value={state} onChange={this.changeHandler}>
                        <option value="">Choose State</option>
                        {states.map(this.option_state)}
                      </select>
                      <br />
                      <MDBInput type="text" name="city" value={city} onChange={this.changeHandler} label="City" />

                      <MDBInput type="textarea" label="Address" name="addressline" value={addressline} onChange={this.changeHandler} />

                      {/* <MDBIcon icon="city" /><label for="city">City</label> 
                   <select name="city" value={city}  onChange={this.changeHandler} id="city">
                   <option value="Ahmedabad">Choose City</option>
                    <option value="Ariyalur">Ariyalur</option>
                   <option value="Chennai">Chennai</option>
                       <option value="Krishnagiri">Krishnagiri</option>
                       </select> */}

                      <MDBInput
                        label="Pincode"
                        name="pincode"
                        value={pincode}
                        group
                        type="text"
                        onChange={this.changeHandler}
                        validate
                        error="wrong"
                        success="right"
                      />
                      <MDBInput
                        label="Contact"
                        name="contact"
                        value={contact}
                        group
                        type="text"
                        onChange={this.changeHandler}
                        validate
                        error="wrong"
                        success="right"
                      />

                    </div>
                    
                    <div className="text-center p-2">
                      <MDBBtn color="cyan" type="submit">
                        Register
                      </MDBBtn>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            {/* <MDBCol>
            <MDBCard cascade>
              <MDBCardImage cascade className="img-fluid" src="https://images.unsplash.com/photo-1575989762363-c7ce0137427a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVlcGFtfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80" />

            </MDBCard>
          </MDBCol> */}

            <MDBCol lg="2"></MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}


export default RegisterPage;



