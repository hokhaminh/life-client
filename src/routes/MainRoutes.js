// Libs
import { Routes, Route } from "react-router-dom";
import React from "react";
import DashBoard from "../pages/DashBoard";
import Register from "../pages/Authentication/Register";
import Login from "../pages/Authentication/Login";

import KhaMinh from "../pages/KhaMinh";
import UserRoute from "./UserRoute";
import CreatePost from "../pages/Post/CreatePost";
import PostDetail from "../pages/Post/PostDetail";
import Profile from "../pages/Profile";
import UpdatePost from "../pages/Post/UpdatePost";

const MainRoute = () => {
    return (
        <Routes>
            {/* DashBoard */}
            <Route path="/" element={<DashBoard />} />

            <Route path="/post/:id" element={<PostDetail />} />

            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<UserRoute />}>
                <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/post/update/:id" element={<UpdatePost />} />

            <Route path="/" element={<UserRoute />}>
                <Route path="/create/post" element={<CreatePost />} />
            </Route>
        </Routes>
    );
};

export default MainRoute;
