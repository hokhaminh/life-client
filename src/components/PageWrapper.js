import React from "react";
import styles from "../styles/PageWrapper.module.css";
import HorizontalNav from "./HorizontalNav";

const PageWrapper = ({ children, className = "", style = {} }) => {
    return (
        <div
            style={{
                ...style,
                width: "100vw",
                minHeight: "100vh",
            }}
            className={`${styles.main} ${className}`}
        >
            <HorizontalNav />
            {children}
        </div>
    );
};

export default PageWrapper;
