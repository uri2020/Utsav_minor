import React from 'react'
import { useState } from 'react';
import Logo from '../images/logo.png';
import '../SplashScreen/SplashScreen.css';
// import Preloader from '../Others/Preloader.js';
export default function SplashScreen() {
    const [logo,setLogo] = useState(Logo);
    setTimeout(() => {
    window.location.replace("/home");
    },3000)
    return (
        <div className="center">
            <center>
            <table>
               <tr>
                   <td><img src={logo} className="splash-logo" alt="logo"></img></td>
                   <td><span className="fade-in splash-brand">Utsav</span></td>
               </tr>
           </table>
           <p>Let's celebrate festivals together, virtually.</p>
           <div class="loader"></div>
            </center>          
        </div>
              
        
    )
}
