import React from "react";
import "../styles/Loading.css";

const Loading = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: "100vh",
                width: "100vw",
                position: "absolute",
                backgroundOpacity: "0.3",
            }}
        >
            <div className="loadingio-spinner-eclipse-a5ivrcnct5j">
                <div className="ldio-bn5u1hese6e d-flex justify-content-center align-items-center ">
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
