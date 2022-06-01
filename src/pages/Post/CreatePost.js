import React, { useState } from "react";
import * as Yup from "yup";
import "../../styles/Posts/CreatePost.css";
import Button from "../../components/Button";
import { useFormik } from "formik";
import { useLazyFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import HorizontalNav from "../../components/HorizontalNav";
import { useNavigate } from "react-router-dom";
import MyInput from "../../components/MyInput";
import { useTitle } from "../../utils/useTitle";
import moment from "moment";
const CreatePost = () => {
    const FILE_SIZE = 160 * 1024;
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
    const user = localStorage.getItem("life");
    useTitle("Create Post");
    const [urlTemp, setUrlTemp] = useState();
    const navigate = useNavigate();

    //The main formik hook for the Post
    const formik = useFormik({
        initialValues: {
            fullname: "",
            birthyear: "",
            deathyear: "",
            description: "",
            image: "",
            password: "",
            title: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required("Fullname is required"),
            birthyear: Yup.date()
                .required("Birthyear is required")
                .min(
                    Yup.ref(moment()),
                    "Birthyear must be less than current day"
                ),
            deathyear: Yup.date()
                .required("Deathyear is required")
                .min(
                    Yup.ref("birthyear"),
                    "Death year must be after birth year"
                ),
            description: Yup.string().required("Description is required"),
            image: Yup.mixed()
                .required("Image is required")
                .test(
                    "fileSize",
                    "File Size is too large",
                    (value) => value?.size <= FILE_SIZE
                )
                .test("fileType", "Unsupported File Format", (value) =>
                    SUPPORTED_FORMATS.includes(value?.type)
                ),
            password: Yup.string().required("Password is required"),
            title: Yup.string().required("Title is required"),
        }),
        onSubmit: (values) => {
            Swal.fire({
                title: "Are you sure?",
                text: "Press OK to continue",
                icon: "warning      ",
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
                    formData.append("userId", JSON.parse(user).userId);
                    fetchData("", {
                        body: formData,
                    });
                }
            });
        },
    });

    //Fetch data to create a post
    const [fetchData, { loading }] = useLazyFetch(`${API}/post/create`, {
        method: "post",
        onCompleted: (data) => {
            Swal.fire({
                title: "Create post successfully!",
                text: "Press OK to navigate to the Post page",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#445279",
                cancelButtonColor: "#e76565",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/post/${data}`);
                } else {
                    navigate("/");
                }
            });
        },
        onError: (error) => {
            Swal.fire("Create post failed!", error.message, "error");
        },
    });

    return (
        <>
            {loading && <Loading />}
            <HorizontalNav />
            <div style={{ marginTop: "3.5rem" }}>
                <div className="headerDiv">
                    <h1 className="mb-3">
                        Create a place to share memories of your loved one
                    </h1>
                    <q className="fs-5 fst-italic">
                        When someone you love becames a memory,
                        <br /> the memory becames a treasure.
                    </q>
                </div>
                <div>
                    <form className="w-100" onSubmit={formik.handleSubmit}>
                        <div className="d-flex justify-content-evenly form_div">
                            <div>
                                {/* Fullname Input */}
                                <MyInput
                                    name="fullname"
                                    label="Fullname"
                                    type="text"
                                    value={formik.values.fullname}
                                    onChange={formik.handleChange}
                                    errorMessage={formik.errors.fullname}
                                    errorTouched={formik.touched.fullname}
                                />

                                {/* BirthYear Input */}
                                <MyInput
                                    name="birthyear"
                                    label="BirthYear"
                                    type="date"
                                    value={formik.values.birthyear}
                                    onChange={formik.handleChange}
                                    errorMessage={formik.errors.birthyear}
                                    errorTouched={formik.touched.birthyear}
                                />

                                {/* DeathYear Input */}
                                <MyInput
                                    name="deathyear"
                                    label="DeathYear"
                                    type="date"
                                    value={formik.values.deathyear}
                                    onChange={formik.handleChange}
                                    errorMessage={formik.errors.deathyear}
                                    errorTouched={formik.touched.deathyear}
                                />

                                {/* Image Input */}
                                <label
                                    htmlFor="image"
                                    className="ms-3 form-label"
                                >
                                    Image
                                </label>
                                <input
                                    className="form-control"
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
                                {formik.errors.image &&
                                    formik.touched.image && (
                                        <p className="text-danger">
                                            {formik.errors.image}
                                        </p>
                                    )}
                                <img src={urlTemp} className="imageTemp" />
                            </div>
                            <div>
                                {/* Title Input */}
                                <MyInput
                                    name="title"
                                    label="Title"
                                    type="text"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    errorMessage={formik.errors.title}
                                    errorTouched={formik.touched.title}
                                />

                                {/* Description Input */}
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
                                    cols="57"
                                    className="input_desctiption"
                                    placeholder="Share your story right here"
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                ></textarea>
                                {formik.errors.username &&
                                    formik.touched.username && (
                                        <p className="text-danger">
                                            {formik.errors.username}
                                        </p>
                                    )}

                                {/* Password Input */}
                                <MyInput
                                    name="password"
                                    label="Password"
                                    type="text"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    errorMessage={formik.errors.password}
                                    errorTouched={formik.touched.password}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Button className="mt-4 px-5 py-3">Confirm</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreatePost;
