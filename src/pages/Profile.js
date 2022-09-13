import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
    BoxArrowRight,
    ChatText,
    PencilSquare,
    XSquare,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/constant";
import HorizontalNav from "../components/HorizontalNav";
import "../styles/Profile.css";
import { useLazyFetch } from "../utils/useFetch";
import moment from "moment";
import Swal from "sweetalert2";
import { useTitle } from "../utils/useTitle";
import Loading from "../components/Loading";

const Profile = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("life");
        localStorage.removeItem("accesstoken");
        navigate("/");
    };
    const user = localStorage.getItem("life");

    const [fetchDataProfile, { data, loading }] = useLazyFetch(
        `${API}/profile/${JSON.parse(user).userId}`
    );
    //Fetch API Delete post
    const [fetchDataDelete] = useLazyFetch();

    useTitle(data?.fullname);
    useEffect(() => {
        fetchDataProfile();
    }, []);
    return (
        <div>
            {loading && <Loading />}
            <HorizontalNav />
            <div className="header">
                <h1 className="ms-5">{data?.fullname}</h1>
                <button className="ms-auto me-3 logout_btn" onClick={logout}>
                    <BoxArrowRight className="me-1 mb-1" />
                    Log out
                </button>
            </div>
            <div className="profile-container">
                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3 w-100"
                >
                    <Tab eventKey="home" title="About">
                        <InFor name={"User ID"} value={data?.userId} />
                        <InFor name="Fullname" value={data?.fullname} />
                        <InFor name="Email" value={data?.email} />
                        <InFor
                            name="Created day"
                            value={moment(data?.createdAt).format(
                                "MMMM Do YYYY"
                            )}
                        />
                        <InFor name="Username" value={data?.userName} />
                    </Tab>
                    <Tab eventKey="profile" title="Post Created">
                        {data?.posts.map((post) => (
                            <PostCreated
                                key={post.postId}
                                fullname={post.fullname}
                                birthyear={moment(post.birthYear).format(
                                    "YYYY"
                                )}
                                deathYear={moment(post.deathYear).format(
                                    "YYYY"
                                )}
                                CreatedAt={moment(post.createdAt).format(
                                    "DD/MM/YYYY"
                                )}
                                imgURL={post.imageURL}
                                NoComment={post.noComment}
                                link={`/post/${post.postId}`}
                                onClickDelete={() => {
                                    Swal.fire({
                                        title: "Are you Sure",
                                        text: "Press OK to delete",
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonColor: "#445279",
                                        cancelButtonColor: "#e76565",
                                        confirmButtonText: "OK",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            fetchDataDelete(
                                                `${API}/post/${post.postId}`,
                                                {
                                                    method: "delete",
                                                    onCompleted: () => {
                                                        fetchDataProfile();
                                                    },
                                                }
                                            );
                                        }
                                    });
                                }}
                                onClickUpdate={() => {
                                    navigate(`/post/update/${post.postId}`);
                                }}
                            />
                        ))}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
const InFor = ({ name, value, icon }) => {
    return (
        <div className="d-flex px-5">
            <span className="me-2 ">{icon}</span>
            <strong className="flex-grow-1 name_infor">{name}</strong>
            <p className="value_infor">{value}</p>
        </div>
    );
};

const PostCreated = ({
    fullname,
    birthyear,
    deathYear,
    CreatedAt,
    NoComment,
    imgURL,
    link,
    onClickUpdate = () => {},
    onClickDelete = () => {},
}) => {
    const navigate = useNavigate();
    return (
        <div className="d-flex postDiv">
            <div
                className="post-created d-flex justify-content-between align-items-center mb-4 me-2"
                onClick={() => {
                    navigate(link);
                }}
            >
                <img
                    src={
                        imgURL !== null
                            ? imgURL
                            : "https://i.ibb.co/zNDpV0N/depositphotos-189716808-stock-illustration-black-mourning-ribbon-isolated-on.webp"
                    }
                    className="img_post_created"
                    alt="the loved one in small size"
                />
                <div className="d-flex flex-column name-year">
                    <h3 className="fs-6 fs-md-5 w-100">{fullname}</h3>
                    <p>
                        {birthyear} - {deathYear}
                    </p>
                </div>

                <div className="d-flex flex-column create-comment">
                    <p className="text-end">Created: {CreatedAt}</p>
                    <span className="text-end">
                        {NoComment} <ChatText />
                    </span>
                </div>
            </div>
            <div className="d-flex flex-column ">
                <button className="btn_edit" onClick={onClickUpdate}>
                    <PencilSquare size={30} />
                </button>
                <button className="btn_delete" onClick={onClickDelete}>
                    <XSquare size={30} />
                </button>
            </div>
        </div>
    );
};
