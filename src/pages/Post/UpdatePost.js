import React, { useState } from "react";
import HorizontalNav from "../../components/HorizontalNav";
import "../../styles/Posts/UpdatePost.css";
import MyInput from "../../components/MyInput";
import Button from "../../components/Button";
import { useFormik } from "formik";
import { useLazyFetch, useFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
const UpdatePost = () => {
    const FILE_SIZE = 160 * 1024;
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
    const user = localStorage.getItem("life");
    const [urlTemp, setUrlTemp] = useState();

    const [data, setData] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    //get postId from useParam
    const { id } = useParams();

    useFetch(`${API}/post/${id}`, {
        onCompleted: (data) => {
            setData(data);
            setUrlTemp(data.imageURL);
        },
    });
    useFetch(`${API}/post/password/${id}`, {
        onCompleted: (data) => {
            setPassword(data);
        },
    });
    const formik = useFormik({
        initialValues: {
            fullname: data?.fullname,
            birthyear: moment(data?.birthYear).format("YYYY-MM-DD"),
            deathyear: moment(data?.deathYear).format("YYYY-MM-DD"),
            description: data?.description,
            image: "",
            password: password,
            title: data?.title,
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required("Fullname is required"),
            birthyear: Yup.date().required("Birthyear is required"),
            deathyear: Yup.date()
                .required("Deathyear is required")
                .min(
                    Yup.ref("birthyear"),
                    "Death year must be after birth year"
                ),
            description: Yup.string().required("Description is required"),
            image: Yup.mixed()
                .test(
                    "fileSize",
                    "File Size is too large",
                    (value) => value.size <= FILE_SIZE
                )
                .test("fileType", "Unsupported File Format", (value) =>
                    SUPPORTED_FORMATS.includes(value.type)
                ),
            password: Yup.string().required("Password is required"),
            title: Yup.string().required("Title is required"),
        }),
        enableReinitialize: true,
        onSubmit: () => {
            Swal.fire({
                title: "Are you Sure",
                text: "Press OK to continue",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#445279",
                cancelButtonColor: "#e76565",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    const formData = new FormData();
                    formData.append("image", formik.values.image);
                    formData.append("title", formik.values.title);
                    formData.append("description", formik.values.description);
                    formData.append("birthYear", formik.values.birthyear);
                    formData.append("deathYear", formik.values.deathyear);
                    formData.append("fullname", formik.values.fullname);
                    formData.append("password", formik.values.password);
                    formData.append("postId", id);
                    fetchDataUpdate("", {
                        body: formData,
                    });
                }
            });
        },
    });

    const [fetchDataUpdate] = useLazyFetch(
        `${API}/post/${JSON.parse(user).userId}/update`,
        {
            method: "put",
            onCompleted: () => {
                let timerInterval;
                Swal.fire({
                    title: "Update successfully",
                    html: "You will be redirected in <b></b> milliseconds.",
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const b = Swal.getHtmlContainer().querySelector("b");
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft();
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                        navigate("/profile");
                    },
                });
            },
            onError: (error) => {
                Swal.fire("Update failed!", error.message, "error");
            },
        }
    );
    return (
        <div>
            <HorizontalNav />
            <div>
                <form
                    className="d-flex justify-content-center"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="form_div2">
                        <h1 className="header_update_form">Edit Information</h1>
                        <MyInput
                            name="fullname"
                            label="Fullname"
                            type="text"
                            className="mb-2"
                            value={formik.values.fullname}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.fullname}
                            errorTouched={formik.touched.fullname}
                        />
                        <MyInput
                            name="birthyear"
                            label="BirthYear"
                            type="date"
                            className="mb-2"
                            value={formik.values.birthyear}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.birthyear}
                            errorTouched={formik.touched.birthyear}
                        />
                        <MyInput
                            name="deathyear"
                            label="DeathYear"
                            type="date"
                            className="mb-2"
                            value={formik.values.deathyear}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.deathyear}
                            errorTouched={formik.touched.deathyear}
                        />
                        <div className="input_file_update">
                            <label
                                htmlFor="image"
                                className="ms-3  d-inline form-label"
                            >
                                Image
                            </label>
                            <input
                                className="form-control input_update_post_image d-inline"
                                type="file"
                                id="image"
                                name="image"
                                onChange={(event) => {
                                    formik.setFieldValue(
                                        "image",
                                        event.currentTarget.files[0]
                                    );
                                    const reader = new FileReader();
                                    reader.readAsDataURL(
                                        event.currentTarget.files[0]
                                    );
                                    reader.onload = () => {
                                        setUrlTemp(reader.result);
                                    };
                                }}
                            />
                            {formik.errors.imageURL &&
                                formik.touched.imageURL && (
                                    <p className="text-danger">
                                        {formik.errors.imageURL}
                                    </p>
                                )}
                        </div>
                        <img
                            src={urlTemp}
                            alt="Preview"
                            className="imageTemp_update"
                        />

                        <MyInput
                            name="title"
                            label="Title"
                            type="text"
                            className="mb-2"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.title}
                            errorTouched={formik.touched.title}
                        />
                        <label
                            htmlFor="description"
                            className="d-block ms-3 mb-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            // cols="73"
                            className="input_description_update mb-2"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        ></textarea>
                        {formik.errors.username && formik.touched.username && (
                            <p className="text-danger">
                                {formik.errors.username}
                            </p>
                        )}
                        <MyInput
                            name="password"
                            label="Password"
                            type="text"
                            className="mb-2"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.password}
                            errorTouched={formik.touched.password}
                        />
                        <div className="d-flex justify-content-center">
                            <Button className="mt-4 px-5 py-3">SAVE</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePost;
