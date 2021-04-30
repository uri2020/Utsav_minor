import React from 'react'
import { Link } from "react-router-dom";
import './LoginHeader.css';

function LoginHeader() {
    return (
        <div className="header">
            <Link className="link" to="/">
                <img className="header__logo" src="https://www.freelogodesign.org/file/app/client/thumb/04aaa647-bdfd-4ad8-a027-9dea626d8f36_200x200.png?1609334748636" alt="Utsav Logo" />
            </Link>
            <Link className="link" to="/register">
                <button className="header__button">Create New Account</button>
            </Link>
        </div>
    )
}

export default LoginHeader
