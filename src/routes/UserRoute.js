import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const UserRoute = () => {
    const user = localStorage.getItem("life");
    if (user == null) return <Navigate to="/" />;

    return <Outlet />;
};

export default UserRoute;
