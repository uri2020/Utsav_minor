// 
import React ,{Component} from "react";
import { MDBContainer,MDBRow,MDBCardHeader,MDBCardImage, MDBCol,MDBIcon,MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
 import fire from '../config/Fire';



class FormPage extends Component{
    constructor(props){
      super(props);
      this.state={
        committeeName:'',
        email:'',
        contactNo:'',
        description:'',
        address:'',
        city:'',
        pincode:'',
        state:'',
        radio: 2

      }

      this.changeHandler = this.changeHandler.bind(this);
      this.submitHandler=this.submitHandler.bind(this);
    }
      changeHandler = e => {

        this.setState ( { [e.target.name] : e.target.value})

      
    }

    onClick = nr => () => {
      this.setState({
        radio: nr
      });
    }

    submitHandler = e => {
      e.preventDefault()
      console.log(this.state)
  

  fire.collection("Pujo_Organizer")
 .add({
    committeeName:this.state.committeeName,
    email:this.state.email,
     contactNo:this.state.contactNo,
    description:this.state.description,
    address:this.state.address,
    city:this.state.city,
    pincode:this.state.pincode,
    state:this.state.state
       
})
  .then(function() {
    alert("Document successfully written👍");
})
  .catch(function(error) {
    console.error("Error writing document: ", error);
});
    }
 render(){
    const{committeeName,email,contactNo,description,address,city,pincode,state}=this.state
  return (
    
    <MDBContainer>
         
      <MDBRow>
      
        <MDBCol md="6">
        
        
          <MDBCard wide>
            <MDBCardBody>
            <MDBCardHeader className="form-header deep-blue-gradient rounded">
                <h3 className="my-3">
                  <MDBIcon icon="cash-register" /> &nbsp; &nbsp; <b><i>Pujo Registration</i></b>
                </h3>
              </MDBCardHeader>
                  <form onSubmit={this.submitHandler}>
                   <div className="grey-text">
                  <MDBInput
                    label="Committee Name/Bari Name"
                    name="committeeName"
                    icon="user"
                    group
                    type="text"
                    value={committeeName}
                    onChange={this.changeHandler}
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBInput
                    label="Email"
                    name="email"
                    icon="envelope"
                    group
                    type="email"
                    value={email}
                    onchange={this.changeHandler}
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBInput
                    label="Contact Number"
                    name="contactNo"
                    icon="phone-alt" 
                    group
                    type="text"
                    value={contactNo}
                    validate
                    error="wrong"
                    success="right"
                  />
                  <MDBInput
                    label="Description"
                    name="description"
                    icon="pencil-alt"
                    group
                    type="text"
                    value={description}
                    validate
                    error="wrong"
                    success="right"
                  />
                
                 <MDBInput type="textarea" name="address" value={address} rows="2" label="Address" icon="address-book" />
                  &nbsp;<MDBIcon icon="city" /><label for="city">&nbsp;&nbsp;&nbsp;&nbsp;City</label> &nbsp;
                    &nbsp; <select  name="city" value={city} id="city">
                     <option value="Ahmedabad">Choose City</option>
                      <option value="Ariyalur">Ariyalur</option>
                     <option value="Chennai">Chennai</option>
                         <option value="Krishnagiri">Krishnagiri</option>
                         </select>
                  <MDBInput
                    label="Pincode"
                    name="pincode"
                    icon="map-pin"
                    group
                    type="text"
                    value={pincode}
                    validate
                    error="wrong"
                    success="right"
                  />
                 
                     
                     &nbsp;<MDBIcon icon="map-marked-alt" /><label for="state">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State</label> &nbsp;
                     <select name="state" value={state} id="state">
                     <option value="Ahmedabad">Choose State</option>
                      <option value="Ariyalur">Tamilnadu</option>
                     <option value="Chennai">Kerala</option>
                         <option value="Krishnagiri">Karnataka</option>
                     </select>
                     <br></br>
                     <br></br>
        
                     &nbsp;<MDBIcon icon="user-edit" />&nbsp;&nbsp;&nbsp;<b>Type of Pujo</b>
                  
                  <br></br>

                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio" id="sarbojonin"  onClick={this.onClick(1)} checked={this.state.radio===1 ? true : false}/> Sarbonin<br></br>
         
        
                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio"  onClick={this.onClick(2)} checked={this.state.radio===2 ? true : false}  id="bonedi bari" /> Bonedi Bari<br></br>
                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio" onClick={this.onClick(3)} checked={this.state.radio===3 ? true : false} id="housing complex" /> Housing Complex<br></br>
                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio" onClick={this.onClick(4)} checked={this.state.radio===4 ? true : false} id="math/mision" /> Math/Mission<br></br>
                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio" onClick={this.onClick(5)} checked={this.state.radio===5 ? true : false} id="prabasi" /> Prabasi<br></br>
                  &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;<input type="radio" onClick={this.onClick(6)} checked={this.state.radio===6 ? true : false} id="others" /> Others<br></br>
              
             
                </div>
                
                
                <div className="text-center py-4 mt-3">
                  <MDBBtn color="cyan" type="submit">
                    Register
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard cascade>
            <MDBCardImage cascade className="img-fluid" src="https://images.unsplash.com/photo-1575989762363-c7ce0137427a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVlcGFtfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80" />
           
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
          
  );
}
}

export default FormPage;



