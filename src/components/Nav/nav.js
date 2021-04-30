import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import logo from "../images/logo.png";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import PeopleIcon from "@material-ui/icons/PeopleAltOutlined";
import OndemandVideoIcon from "@material-ui/icons/VideoLibraryOutlined";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PostAddIcon from "@material-ui/icons/PostAdd";
import HistoryIcon from "@material-ui/icons/History";
import SearchIcon from "@material-ui/icons/Search";
import NotesIcon from "@material-ui/icons/Notes";
import Modal from "@material-ui/core/Modal";
import "./styles/Nav.css";
import "./styles/Mainsearchbar.css";
import { auth } from "../config/firebase.js";
//import './styles/w3.css'
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../config/firebase.js";
import cities from "../data/cities";
import states from "../data/states";
import PersonOutlineSharpIcon from "@material-ui/icons/PersonOutlineSharp";
import GTranslateSharpIcon from "@material-ui/icons/GTranslateSharp";
import NotificationsSharpIcon from "@material-ui/icons/NotificationsSharp";
import MoreVertSharpIcon from "@material-ui/icons/MoreVertSharp";
import ModalSetLanguage from "../Translate/ModalSetLanguage";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";

const open_sidebar = () => {
  var sidebar = document.getElementById("side-menu");
  sidebar.style.left = 0;
};

const Navbar = (props) => {
  const history = useHistory();
  //const user = props.user;
  var storedNames = JSON.parse(localStorage.getItem("recentSearches"));
  const [search, setSearch] = useState("");
  const [filtervalues, setFilterValues] = useState([]);
  const [searchResult, setSearchResult] = useState("");
  const [searchOption, setSearchOption] = useState("small_name");
  const [userList, setUserList] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [emptyCityStateList, setEmptyCityStateList] = useState(false);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [update, setUpdate] = useState(false);
  const [recentSearches, setRecentSearches] = useState(
    storedNames === null ? [] : storedNames
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function getData() {
      db.collection("Users")
        .orderBy("small_name")
        .startAt(search.toLowerCase())
        .limit(6)
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            setSearchResult("No results");
          } else {
            setFilterValues(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
            setUpdate(false);
            setShowMoreResults(true);
          }
        });
    }

    if (search !== "" && searchOption === "small_name") getData();
  }, [search, searchOption]);

  useEffect(() => {
    if (update) {
      const last = filtervalues[filtervalues.length - 1];
      setShowMoreResults(false);
      console.log("UseEffect");

      if (last !== undefined) {
        db.collection("Users")
          .orderBy(searchOption)
          .startAfter(last.data.small_name)
          .limit(8)
          .onSnapshot((snapshot) => {
            if (!snapshot.empty) {
              const array = snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }));

              setFilterValues([...filtervalues, ...array]);
              setShowMoreResults(true);
            }
          });
      }
    }
  }, [update]);

  useEffect(() => {
    //checkForEmptyCityStateList
    let result = [];
    if (searchOption === "small_city") {
      result = cities.filter((val) => {
        if (search === "") return val;
        else if (val.name.toLowerCase().includes(search.toLowerCase())) {
          return val;
        }
        return null;
      });
    } else if (searchOption === "small_state") {
      result = states.filter((val) => {
        if (search === "") return val;
        else if (val.name.toLowerCase().includes(search.toLowerCase())) {
          return val;
        }
        return null;
      });
    }

    if (result.length === 0) {
      setEmptyCityStateList(true);
    } else {
      setEmptyCityStateList(false);
    }
  }, [searchOption, search]);

  function myFunction() {
    document.getElementById("myDropdown").classList.add("show");
  }

  const getUserData = (value) => {
    setSearchResult("");
    db.collection("Users")
      .where(searchOption, "==", value.toLowerCase())
      .get()
      .then((snap) => {
        // console.log(snap.docs);
        if (snap.empty) setSearchResult("No Matches Found");
        const array = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setSearch(value);
        setUserList([...array]);
        setShowUserList(true);
      });
  };

  function CityList(cvalue, index) {
    return (
      <p
        className="CityStateListItem"
        key={index.toString()}
        onClick={() => getUserData(cvalue.name)}
      >
        {cvalue.name}
      </p>
    );
  }

  function StateList(cvalue, index) {
    return (
      <p
        className="CityStateListItem"
        key={index.toString()}
        onClick={() => getUserData(cvalue.name)}
      >
        {cvalue.name}
      </p>
    );
  }

  function Recent(cvalue, index) {
    return (
      <p
        key={index.toString()}
        className="recentsearch"
        onClick={() => viewProfile(cvalue.id, cvalue.name)}
      >
        <HistoryIcon fontSize="small" style={{ marginRight: 5 }} />
        {cvalue.name}
      </p>
    );
  }

  function getUserList(currentValue, index) {
    //alert("helo");

    return (
      <div
        key={index.toString()}
        onClick={() => viewProfile(currentValue.id, currentValue.data.name)}
        className="userRow"
      >
        <table>
          <tbody>
            <tr>
              <td>
                {" "}
                <img
                  style={{ borderRadius: "50%", width: "40px", height: "40px" }}
                  src={currentValue.data.dp}
                  alt="dp"
                />
              </td>
              <td>
                <option
                  key={currentValue.id}
                  data-icon={currentValue.data.dp}
                  style={{ marginLeft: "10px", fontWeight: "bold" }}
                >
                  {currentValue.data.name}
                </option>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  var myDropdown = document.getElementById("myDropdown");
  window.onclick = function (e) {
    if (e.target.matches(".closebtn")) {
      if (myDropdown.classList.contains("show")) {
        myDropdown.classList.remove("show");
      }
    }
  };

  function typing(e) {
    setSearch(e.target.value);
    if (showUserList) setShowUserList(false);

    if (e.target.value.length >= 3) {
      myDropdown.classList.add("show");
      //console.log(filtervalues)
    } else {
      setFilterValues([]);
      //myDropdown.classList.remove('show');
    }
  }

  function closeDropdown() {
    myDropdown.classList.remove("show");
    setSearch("");
  }

  function SearchOptionHandle(e) {
    setSearchOption(e.target.attributes.value.value);
    setSearch("");
    setShowUserList(false);
    setUserList([]);
  }

  const openLangModal = () => {
    if (window.innerWidth > 750) setOpen(true);
    else history.push("/createpost");
  };

  function showMore(entries) {
    if (entries[0] && entries[0].isIntersecting) {
      if (filtervalues[0]) {
        setUpdate(true);
      }
    }
  }

  let options = {
    rootMargin: "0px",
    threshold: 0.5,
  };

  const element = document.getElementById("showMoreResults");
  if (element) {
    let observer = new IntersectionObserver(showMore, options);
    observer.observe(element);
  }

  function viewProfile(userId, name) {
    history.push("/profile/" + userId);

    let array = recentSearches;
    const index = array.findIndex((cvalue) => {
      return cvalue.id === userId;
    });
    if (index !== -1) array.splice(index, 1);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify([{ name: name, id: userId }, ...array])
    );
    if (array.length > 6) array.pop();

    // localStorage.removeItem("recentSearches");
  }

  const closeLangModal = () => {
    setOpen(false);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }));

  function MenuListComposition() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    const type = localStorage.getItem("type");
    const logout = (event) => {
      event.preventDefault();
      auth.signOut();
      localStorage.removeItem("Username");
      localStorage.removeItem("Dp");
      localStorage.removeItem("city");
      if (type === "indi") localStorage.removeItem("gender");
      if (type === "com") localStorage.removeItem("upvotes");
      localStorage.removeItem("type");
      localStorage.removeItem("visits");
      localStorage.removeItem("follows");
      // history.push('/login')
      history.push("/onboarding");
    };
    function handleListKeyDown(event) {
      if (event.key === "Tab") {
        event.preventDefault();
        setOpen(false);
      }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }

      prevOpen.current = open;
    }, [open]);

    return (
      <div className={classes.root}>
        <div>
          <span
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            id="morevertical_nav"
          >
            <MoreVertSharpIcon />
          </span>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            style={{zIndex:"8"}}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleClose}>My account</MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="Nav">
        <div className="nav-top-sm">
          <div className="sidebar-btn" onClick={open_sidebar}>
            <NotesIcon
              style={{ color: "black", fontSize: "28px", marginRight: "10px" }}
            />
          </div>
          <Link to="/home">
            <img src={logo} alt="" className="logo-sm" />
          </Link>
          <span className="nav-brand-heading-sm">Utsav</span>
          <NavLink to="#">
            <SearchIcon style={{ color: "white", margin: "0 10px" }} />
          </NavLink>
          <NavLink to="/notifications">
            <NotificationsActiveIcon style={{ color: "white" }} />
          </NavLink>
        </div>

        <div className="menu">
          <div id="nav_brandSearch">
            {" "}
            <div className="nav-brand">
              <img src={logo} alt="logo" className="logo" />
              {/* <span className="nav-brand-heading">Utsav</span> */}
            </div>
            <div className="search">
              <div className="search-icon">
                <SearchIcon />
              </div>
              <div className="dropdown">
                <input
                  type="text"
                  value={search}
                  onClick={myFunction}
                  autoComplete="off"
                  onChange={typing}
                  className="searchbox dropbtn"
                />
              </div>

              <div className="dropdown-content" id="myDropdown">
                <button className="closebtn" onClick={closeDropdown}>
                  &#10005;
                </button>
                <div className="searchOption">
                  <span
                    className={searchOption === "small_name" ? "active" : ""}
                    value="small_name"
                    onClick={SearchOptionHandle}
                  >
                    Name
                  </span>
                  <span
                    className={searchOption === "small_city" ? "active" : ""}
                    value="small_city"
                    onClick={SearchOptionHandle}
                  >
                    City/District
                  </span>
                  <span
                    className={searchOption === "small_state" ? "active" : ""}
                    value="small_state"
                    onClick={SearchOptionHandle}
                  >
                    State
                  </span>
                </div>
                {search === "" &&
                recentSearches.length > 0 &&
                searchOption === "small_name" ? (
                  <div>
                    <p style={{ color: "gray", marginBottom: 0 }}>
                      <small>Recent Searches</small>
                    </p>
                    {recentSearches.map(Recent)}
                  </div>
                ) : null}

                {searchOption === "small_name" ? (
                  <div className="searchResults">
                    {search && filtervalues.map(getUserList)}
                    {search === "" ? "" : searchResult}
                    {showMoreResults && <div id="showMoreResults"></div>}
                  </div>
                ) : (
                  <div className="searchResults">
                    {showUserList === false ? (
                      <>
                        {searchOption === "small_city"
                          ? cities
                              .filter((val) => {
                                if (search === "") return val;
                                else if (
                                  val.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                ) {
                                  return val;
                                }
                                return null;
                              })
                              .map(CityList)
                          : states
                              .filter((val) => {
                                if (search === "") return val;
                                else if (
                                  val.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                ) {
                                  return val;
                                }
                                return null;
                              })
                              .map(StateList)}
                        {emptyCityStateList && (
                          <p style={{ fontWeight: "bold", fontSize: 14 }}>
                            No matches found
                          </p>
                        )}
                      </>
                    ) : (
                      <div>
                        <p>
                          <small>
                            Showing users filtered by{" "}
                            {searchOption === "small_city"
                              ? " city "
                              : " state "}{" "}
                            {search}
                          </small>
                        </p>
                        {userList.map(getUserList)}
                        {search === "" ? (
                          ""
                        ) : (
                          <p style={{ fontWeight: "bold", fontSize: 14 }}>
                            {searchResult}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
        </div>
        <div className="menu_a">
          <NavLink to="/home" exact activeClassName="menu-active">
            <HomeIcon style={{ marginBottom: "3px" }} />
          </NavLink>
          <NavLink to="/people" exact activeClassName="menu-active">
            <PeopleIcon style={{ marginBottom: "3px" }} />
          </NavLink>
          <NavLink to="/clips" exact activeClassName="menu-active">
            <OndemandVideoIcon />
          </NavLink>
          <NavLink to="/community" exact activeClassName="menu-active">
            <PostAddIcon />
          </NavLink>
        </div>

        <div id="right_buttons_menu">
          <button id="menu_button_a">Post</button>
          <button onClick={openLangModal}>
            <GTranslateSharpIcon />
          </button>
          <Link to="/notifications">
            <button>
              <NotificationsSharpIcon />
            </button>
          </Link>
          <button>
            <PersonOutlineSharpIcon />
          </button>
          <button id="morevertical_nav">
            <MenuListComposition />
          </button>
        </div>
      </div>

      <Modal open={open} onClose={closeLangModal}>
        <center style={{ transform: "translate(0px, 20%)" }}>
          <div
            style={{
              backgroundColor: "white",
              width: "fit-content",
              height: "250px",
              borderRadius: "5px",
              padding: "1rem",
              border: "0.05rem solid lightgray",
            }}
          >
            <span
              onClick={closeLangModal}
              style={{
                float: "right",
                cursor: "pointer",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.07)",
                padding: "5px 10px",
                color: "rgba(0,0,0,0.7)",
              }}
            >
              &#10006;
            </span>
            <br></br>
            <br></br>
            <ModalSetLanguage />
          </div>
        </center>
      </Modal>
    </>
  );
};

export default Navbar;
