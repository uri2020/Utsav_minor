import React from 'react';
import './styles/Footer.css';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';

const Footer = () => {
    return (
        <footer>
        <div className="container">
            <div className="row">
                <div className="links col-lg-2" data-aos="fade">
                    <h5 style={{ color: 'gray' }}>Links</h5>
                    <ul>
                        <li><a href="/aboutus">About Us</a></li>
                        <li><a href="/contactus">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="social col-lg-3" data-aos="fade">
                    <h5 style={{ color: 'gray' }}>Social</h5>
                    <a href="https://www.facebook.com/applexTeam" target="_blank">
                        <FacebookIcon />
                    </a>
                    <a href="#" target="_blank" style={{ color: 'indigo', margin: '0 5px' }}>
                        <InstagramIcon />
                    </a>
                    <a href="#" target="_blank" style={{ color: 'skyblue' }}>
                        <TwitterIcon />
                    </a>
                    <p>
                        <EmailIcon /> contact@applex.in
                    </p>
                </div>
                <div className="newsletter col-lg-4" data-aos="fade">
                    <p>Subscribe to our Newsletter</p>
                    <input type="text" placeholder="Email Address" /><br />
                    <button className="btn btn-outline-danger" style={{ padding: '2px 5px' }}>Subscribe</button>
                </div>
                <div className="col-lg-3" data-aos="fade">
                    <h5 style={{ color: 'gray' }}>Contact Us :</h5>
                    <p style={{ color: 'black' }}>Salt Lake, Sector V Kolkata, West Bengal, India.<br />
                        Phone: +91 6290438875
                    </p>
                </div>
            </div>
            </div>
        </footer>
    );
}

export default Footer;
