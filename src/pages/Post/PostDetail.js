import React, { useEffect, useState } from "react";
import HorizontalNav from "../../components/HorizontalNav";
import "../../styles/Posts/PostDetail.css";
import Button from "../../components/Button";
import { useFetch, useLazyFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
const PostDetail = () => {
    const user = localStorage.getItem("life");
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    //check if the user is the owner of the post

    //get postId from useParam
    const { id } = useParams();
    //get the current URL
    const location = useLocation();
    //copy the param text (URL)
    function copy(text) {
        navigator.clipboard.writeText(text);
    }
    //get post detail
    const { loading, data } = useFetch(`${API}/post/${id}`, {
        onCompleted: (data) => {
            if (data.userId === JSON.parse(user).userId) {
                setCheck(true);
            }
            fetchDataComment();
        },
        onError: (error) => {
            Swal.fire({
                title: "Oops...",
                text: "Post not found",
                icon: "error",
                confirmButtonColor: "#445279",
                confirmButtonText: "Back to home",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/");
                }
            });
        },
    });

    //get comment
    const [fetchDataComment, fetchResult] = useLazyFetch(
        `${API}/comment/${id}`,
        {
            onError: (error) => {
                // Swal.fire("Get comment failed!", error.message, "error");
            },
        }
    );

    //create comment
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            content: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().required("Email is required"),
            content: Yup.string().required("Content is required"),
        }),
        onSubmit: () => {
            fetchData();
            formik.resetForm();
        },
    });
    const [fetchData] = useLazyFetch(`${API}/comment/create`, {
        method: "post",
        body: {
            name: formik.values.name,
            email: formik.values.email,
            commentContent: formik.values.content,
            postId: id,
        },
        onCompleted: () => {
            fetchDataComment();
        },
        onError: (error) => {
            Swal.fire("Create comment failed!", error.message, "error");
        },
        // finally: (result) => {
        //     navigate("/");
        // },
    });
    //check password
    const formik2 = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: () => {
            fetchDataCheck();
        },
    });
    const [fetchDataCheck] = useLazyFetch(`${API}/post/password`, {
        method: "post",
        body: {
            password: formik2.values.password,
            postId: id,
        },
        onCompleted: (data) => {
            if (data === true) {
                setCheck(!check);
            } else if (check === false) {
                Swal.fire("Password is wrong!", "", "error");
            }
        },
        onError: (error) => {
            Swal.fire("Create comment failed!", error.message, "error");
        },
    });

    // useEffect(() => {
    //     fetchDataComment();
    // }, []);

    if (check === false) {
        return (
            <div className="body_password">
                <HorizontalNav />
                <div className="password_section">
                    <form
                        className="form_password"
                        onSubmit={formik2.handleSubmit}
                    >
                        <h3 className="password_title">PASSWORD</h3>
                        <input
                            type="password"
                            className="input_password"
                            id="password"
                            name="password"
                            value={formik2.values.password}
                            onChange={formik2.handleChange}
                        />
                        <button className="btn_password" type="submit">
                            SUBMIT
                        </button>
                        <p className="mt-3">
                            Please contact the creator of the post to get the
                            password.
                        </p>
                    </form>
                </div>
            </div>
        );
    }
    return (
        <>
            {/* {loading && <Loading />} */}
            <HorizontalNav />
            <div className="parent1">
                <div className="div11">
                    <h1 className="fullName">{data?.fullname}</h1>
                    <h2 className="birthYear">
                        {moment(data?.birthYear).format("YYYY")}
                        <br />-<br />
                        {moment(data?.deathYear).format("YYYY")}
                    </h2>
                    <h3 className="title">{data?.title}</h3>
                </div>
                <div className="div22">
                    <img
                        src={data?.imageURL}
                        alt="The loved one."
                        className="w-100 img_post"
                    />
                </div>
            </div>

            <h1 className="name_backGround">{data?.fullname.toUpperCase()}</h1>
            <hr />
            <div className="d-flex">
                <p className="description">{data?.description}</p>
                <div className="share">
                    <p className="link_share">
                        https://localhost:3000{location.pathname}
                        <button
                            className="copy_button"
                            onClick={() => {
                                copy(
                                    `https://localhost:3000${location.pathname}`
                                );
                            }}
                        >
                            Copy
                        </button>
                    </p>
                </div>
            </div>
            <div className="comment_section">
                <h1 className="comment_title">Comment</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex justify-content-center ">
                        <div className="d-flex flex-column infor_input">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="text-danger">
                                    {formik.errors.name}
                                </p>
                            )}
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.email && formik.touched.email && (
                                <p className="text-danger">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="d-flex flex-column comment_input">
                            <textarea
                                rows="4"
                                className="mt-4"
                                placeholder="Add a comment..."
                                name="content"
                                id="content"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.content &&
                                formik.touched.content && (
                                    <p className="text-danger">
                                        {formik.errors.content}
                                    </p>
                                )}
                            <Button className="w-100" btn="dark_blue">
                                Post
                            </Button>
                        </div>
                    </div>
                </form>
                <div>
                    {fetchResult.data?.map((record) => (
                        <Comment
                            key={record.commentId}
                            name={record.name}
                            email={record.email}
                            createAt={record.createdAt}
                            content={record.commentContent}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default PostDetail;

const Comment = ({ name, email, createAt, content }) => {
    return (
        <div className="mt-4">
            <div className="name_email">
                <div>
                    <p className="mb-0 fw-bold fs-5">{name}</p>
                    <p className="mb-1">{email}</p>
                </div>
                <p>{moment(createAt).fromNow()}</p>
            </div>
            <div className="comment_content">{content}</div>
            <hr />
        </div>
    );
};
