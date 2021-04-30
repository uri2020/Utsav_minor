
function checkUser(user) {

    //console.log("In CheckUser");
    //const username = localStorage.getItem("Username");

    if ( user === false || user.uid === ''){
        return false;
    }
    else{
        return true;
    }
}

export { checkUser };