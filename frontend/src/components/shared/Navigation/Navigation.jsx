import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import styles from "./Navigation.module.css";

const Navigation = () => {
    const dispatch = useDispatch();
    const {isAuth} = useSelector(state => state.auth)
    const brandStyle = {
        color: "#fff",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "22px",
        display: "flex",
        alignItems: "center",
    };
    const logoText = {
        marginLeft: "10px",
    };

    const handleLogout = async () => {
        try {
            const {data} = await logout()
            dispatch(setAuth(data))
        } catch (error) {
            console.log(error, 'logout')
        }
    }

    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to="/">
                <img src="/images/logo.png" alt="logo" />
                <span style={logoText}>Coder's House</span>
            </Link>
            {isAuth && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navigation;
