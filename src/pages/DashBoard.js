import React from "react";
import "../styles/DashBoard.css";
import HorizontalNav from "../components/HorizontalNav";
import doctorIMG from "../static/doctor.jpg";
import sarahIMG from "../static/sarah-gilbert.jpg";
import familyIMG from "../static/covid-family.jpg";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTitle } from "../utils/useTitle";
const DashBoard = () => {
    const user = localStorage.getItem("life");
    const navigate = useNavigate();

    useTitle("Life");
    return (
        <>
            <HorizontalNav />
            <div className="parent">
                <div className="div1 d-flex flex-column justify-content-center align-items-center">
                    <div>
                        <h1 className="heading_dashboard">
                            Keep Memories Of Your Loved Ones
                        </h1>
                        <p className="fs-5">
                            Almost everyone -- 99% of people that have ever
                            lived are now forgotten. Create an online memorial
                            to keep those memories and share it to people you
                            know.
                        </p>
                        <button
                            className="btn_dashboard"
                            onClick={() => {
                                if (user === null) {
                                    Swal.fire({
                                        text: "Please login to create a memorial",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#445279",
                                        cancelButtonColor: "#e76565",
                                        confirmButtonText: "Login",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            navigate("/login");
                                        }
                                    });
                                } else navigate("/create/post");
                            }}
                        >
                            Create Memorial
                        </button>
                    </div>
                </div>
                <div className="div2 d-flex flex-column align-items-center">
                    <img
                        src={sarahIMG}
                        alt="This is Sarah"
                        className="sarahIMG "
                    />
                    <img
                        src={doctorIMG}
                        alt="This is a doctor"
                        className="doctorIMG"
                    />
                    <img
                        src={familyIMG}
                        alt="This is a family"
                        className="familyIMG"
                    />
                </div>
            </div>
        </>
    );
};

export default DashBoard;
