import React from 'react';
import { useHistory } from 'react-router-dom';
import style from './styles/registertype.module.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

function RegisterType() {
    const history = useHistory('');
    const googleSignin = (history.location.state === undefined || history.location.state === null)  ? null : history.location.state.googleSignin;

    const goToIndividualRegister = () =>{
        history.push({pathname:"/individualregister", state:{googleSignin: googleSignin}});
    }

    const goToPujoRegister = () =>{
        history.push({pathname:"/pujoregister", state:{googleSignin: googleSignin}});
    }

    return (
        <div className={style.main}>
            <div className={style.typeBox}>
                <div className={style.pujo} onClick={goToPujoRegister}>
                    <PeopleAltIcon className={style.icon} />
                    <div>
                        <h5>Pujo</h5>
                        <p>If you are Pujo Organizer</p>
                    </div>
                </div>

                <div className={style.individual} onClick={goToIndividualRegister}>
                    <AccountCircleIcon className={style.icon} />
                    <div>
                        <h5>Individual</h5>
                        <p>If you are a general visitor and want to share your pujo stories</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterType;