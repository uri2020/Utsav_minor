import React from "react";
import Navbar from "../Nav/nav";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class SetLanguage extends React.Component {
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
      <>
        <Navbar />
        <br></br>
        <br></br>
        <center>
        <b>Switch to another language: </b>
          <div style={{marginBottom: "50px",width:"30%",border:"1px solid black",borderRadius:"5px"}}>
            
            <br></br>
            {/* <select
              value={this.state.language}
              style={{ width: "200px", padding: "1rem" }}
              onChange={this.handleLangChange}
            >
              <option value="en">Change Language</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
            </select> */}
            <FormControl component="fieldset" >
              <RadioGroup aria-label="language" name="language" value={this.state.language} onChange={this.handleLangChange}>
                 <FormControlLabel value="en" control={<Radio />} label="English" />
                 <FormControlLabel value="hi" control={<Radio />} label="Hindi" />
                 <FormControlLabel value="bn" control={<Radio />} label="Bengali" />
              </RadioGroup>
            </FormControl>
          </div>
        </center>
      </>
    );
  }
}

export default SetLanguage;
