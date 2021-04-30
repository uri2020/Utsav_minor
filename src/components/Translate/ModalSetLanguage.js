import { yellow } from "@material-ui/core/colors";
import React from "react";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './ModalSetLanguage.css';
class ModalSetLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "English",
       value:null
    };
    if (localStorage.getItem("utsavlang") === "None") {
      localStorage.setItem("utsavlang", "en");
      this.state = {
        language: "English",
      };
    }
    this.handleLangChange = this.handleLangChange.bind(this);
  }

   handleLangChange(evt) {
  
    this.setState({value:evt.target.value});
    localStorage.setItem("utsavlang", evt.target.value);
    this.setState({ language: evt.target.value });
    alert("Changes saved successfully");
    window.location.href = "/";
  }

  render() {
    return (
      <div>
        <center>
          <div >
            <b>Switch to another language: </b> 
            <br></br>
           <FormControl component="fieldset" >
              <RadioGroup aria-label="language" name="language" value={this.state.language} onChange={this.handleLangChange}>
                 <FormControlLabel value="en" control={<Radio />} label="English" />
                 <FormControlLabel value="hi" control={<Radio />} label="Hindi" />
                 <FormControlLabel value="bn" control={<Radio />} label="Bengali" />
              </RadioGroup>
            </FormControl>
          </div>
        </center>
      </div>
    );
  }
}

export default ModalSetLanguage;
