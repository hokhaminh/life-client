import React, { useState } from "react";
import HorizontalNav from "../../components/HorizontalNav";
import "../../styles/Posts/PostDetail.css";
import Button from "../../components/Button";
import { useFetch, useLazyFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useTitle } from "../../utils/useTitle";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const PostDetail = () => {
    const user = localStorage.getItem("life");
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);

    //get postId from useParam
    const { id } = useParams();
    //get the current URL
    const location = useLocation();
    //copy the param text (URL)
    function copy(text) {
        navigator.clipboard.writeText(text);
    }
    useTitle("Life");

    //fetch get user id by post id
    useFetch(`${API}/post/user/${id}`, {
        onCompleted: (data) => {
            if (data === JSON.parse(user).userId) {
                setCheck(true);
                fetchDataPost();
            }
        },
        onError: (error) => {
            Swal.fire("Get post user failed", error.message, "error");
        },
    });

    //fetch check poss password null
    useFetch(`${API}/post/password/null/${id}`, {
        onCompleted: (data) => {
            if (data === true) {
                setCheck(true);
                fetchDataPost();
            }
        },
        onError: (error) => {
            Swal.fire(
                "Something is wrong",
                "Please console for more infomation",
                "error"
            );
        },
    });

    //get post detail
    const [fetchDataPost, fetchPostResult] = useLazyFetch(`${API}/post/${id}`, {
        onCompleted: (data) => {
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
        `${API}/comment/${id}`
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

    //Fetch check password
    const [fetchDataCheck] = useLazyFetch(`${API}/post/password`, {
        method: "post",
        body: {
            password: formik2.values.password,
            postId: id,
        },
        onCompleted: (data) => {
            if (data === true) {
                setCheck(!check);
                fetchDataPost();
            } else if (check === false) {
                Swal.fire("Password is wrong!", "", "error");
            }
        },
        onError: (error) => {
            Swal.fire("Create comment failed!", error.message, "error");
        },
    });

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
    } else {
        return (
            <>
                <HorizontalNav />
                <div className="parent1">
                    <div className="div11">
                        <h1 className="fullName">
                            {fetchPostResult.loading ? (
                                <Skeleton baseColor="#d0d2f5" width="30%" />
                            ) : (
                                fetchPostResult.data?.fullname
                            )}
                        </h1>
                        <h2 className="birthYear">
                            {fetchPostResult.loading ? (
                                <Skeleton baseColor="#d0d2f5" width="20%" />
                            ) : (
                                moment(fetchPostResult.data?.birthYear).format(
                                    "YYYY"
                                )
                            )}
                            <br />-<br />
                            {fetchPostResult.loading ? (
                                <Skeleton baseColor="#d0d2f5" width="20%" />
                            ) : (
                                moment(fetchPostResult.data?.deathYear).format(
                                    "YYYY"
                                )
                            )}
                        </h2>
                        <h3 className="title">
                            {fetchPostResult.loading ? (
                                <Skeleton baseColor="#d0d2f5" count={3} />
                            ) : (
                                fetchPostResult.data?.title
                            )}
                        </h3>
                    </div>
                    <div className="div22">
                        {fetchPostResult.loading ? (
                            <Skeleton
                                baseColor="#d0d2f5"
                                circle
                                height="30%"
                                containerClassName="avatar-skeleton"
                            />
                        ) : (
                            <img
                                src={
                                    fetchPostResult.data?.imageURL !== null
                                        ? fetchPostResult.data?.imageURL
                                        : "https://i.ibb.co/zNDpV0N/depositphotos-189716808-stock-illustration-black-mourning-ribbon-isolated-on.webp"
                                }
                                alt="The loved one."
                                className="w-100 img_post"
                            />
                        )}
                    </div>
                </div>

                <h1 className="name_backGround">
                    {fetchPostResult.data?.fullname.toUpperCase()}
                </h1>
                <hr />
                <div className="d-flex flex-md-row flex-column px-3 py-2">
                    <p className="description">
                        {fetchPostResult.data?.description}
                    </p>
                    <div className="share align-self-center">
                        <p className="link_share">
                            https://living-life.netlify.app{location.pathname}
                            <button
                                className="copy_button"
                                onClick={() => {
                                    copy(
                                        `https://living-life.netlify.app${location.pathname}`
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
                        <div className="d-flex flex-md-row flex-column justify-content-center ">
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
                                {formik.errors.email &&
                                    formik.touched.email && (
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
    }
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
