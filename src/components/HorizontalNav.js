import React from "react";

import { Link, NavLink } from "react-router-dom";
import logo from "../static/logo.jpg";
import style from "../styles/HorizontalNav.module.css";

const HorizontalNav = () => {
    //get user from localStorage
    const user = localStorage.getItem("life");
    return (
        <div className={`d-flex align-items-center ${style.outter}`}>
            <span className={`${style.image}`}>
                <NavLink to="/">
                    <img
                        src={logo}
                        className="img-fluid"
                        alt="Logo of the website"
                    />
                </NavLink>
            </span>
            <span>
                {user === null ? (
                    <Link className={style.login} to="/login">
                        Login
                    </Link>
                ) : (
                    <Link className={style.login} to="/profile">
                        My Account
                    </Link>
                )}
            </span>
            <span className={style.signup}>
                {user === null ? (
                    <Link to="/register" className={`${style.signupBtn}`}>
                        Sign up
                    </Link>
                ) : (
                    <Link to="/create/post" className={`${style.signupBtn}`}>
                        Create a Memorial
                    </Link>
                )}
            </span>
        </div>
    );
};

export default HorizontalNav;
