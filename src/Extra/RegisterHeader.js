import React from 'react'
import { Link } from 'react-router-dom';
import './RegisterHeader.css';

function RegisterHeader() {
    return (
        <div className="header">
            <div className="header__left">
                <Link to="/">
                    <img src="https://www.freelogodesign.org/file/app/client/thumb/04aaa647-bdfd-4ad8-a027-9dea626d8f36_200x200.png?1609334748636" alt="Utsav Logo" className="header__logo" />
                </Link>
            </div>
            <div className="header__right">
                <form>
                    <input className="header__input1" type="email" placeholder="Email" />

                    <input className="header__input2" type="password" placeholder="Password" />

                    <button type="submit" className="header__submit">Log In</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterHeader
