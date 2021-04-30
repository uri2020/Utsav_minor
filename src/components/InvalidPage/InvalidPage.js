import React from 'react'
import Navbar from '../Nav/nav'

import { Link } from "react-router-dom";
import { useState } from 'react';
import Candle from '../images/candle.gif';
export default function InvalidPage(props) {
    const user = props.user;
    const [candle,setCandle] = useState(Candle);
    return (
        <div className="container-fluid home" >
                <Navbar user={user} />
                <div className="home-main" style={{backgroundColor:"black",height:"100vh",width:"100%"}}>
                    <div style={{textAlign:"center",color:"white",width:"inherit"}}>
                         
                        <img src={candle} alt="candle" style={{width:"256px",height:"256px"}}></img>
                       
                       
                        <h1>Oops! Page not found.</h1>
                        <h3 style={{color:"lightgray"}}>We have searched everywhere <br></br>in this darkness..</h3>
                        <p ><Link to="/" style={{color:"lightgray"}}>Go to Utsav home</Link></p>
                    </div>
                </div>
            </div>
    )
}
