import React from 'react'
import './Sidebar.css';
import SidebarRow from './SidebarRow.js';

function Sidebar({ user }) {
    return (
        <div className="sidebar">
            <SidebarRow avatar ImageLink="https://scontent-maa2-2.xx.fbcdn.net/v/t1.30497-1/c94.0.320.320a/p320x320/84241059_189132118950875_4138507100605120512_n.jpg?_nc_cat=1&_nc_sid=dbb9e7&_nc_ohc=xJbPAeMXf4wAX8qQk04&_nc_ht=scontent-maa2-2.xx&oh=1cce9c5de9c5a219ebe87da0179d7633&oe=5F51E03D" title={user?.displayName} />
            <SidebarRow selected ImageLink="https://img.icons8.com/ios/50/000000/globe--v1.png" title="Select language" />
            <SidebarRow selected ImageLink="https://img.icons8.com/metro/50/000000/water.png" title="Set theme" />
            <h3>Communicate</h3>
            <SidebarRow ImageLink="https://img.icons8.com/android/24/000000/share.png" title="Share with friends" />
            <SidebarRow ImageLink="https://img.icons8.com/ios-filled/50/000000/add-contact-to-company.png" title="Contact" />
            
            <SidebarRow ImageLink="https://img.icons8.com/metro/26/000000/rating.png" title="Rate us" />
            <h3>Useful information</h3>
            <SidebarRow ImageLink="https://img.icons8.com/metro/26/000000/about.png" title="About" />
            <SidebarRow ImageLink="https://img.icons8.com/ios-filled/50/000000/security-shield-green.png" title="Privacy" />
            <h3>Account</h3>
            <SidebarRow ImageLink="https://img.icons8.com/ios-filled/50/000000/logout-rounded-down.png" title="Log Out" />
            
        </div>
    )
}

export default Sidebar
