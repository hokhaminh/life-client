// Libs
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import DashBoard from "../pages/Trainee/DashBoard";
import VerticalNavbar from "../components/VerticalNavbar";
import { verticalTrainee } from "../utils/verticalNavbarData";
import HorizontalNavbar from "../components/HorizontalNavbar";
import { useUserAuthorization } from "utils/useAuthorization";

const TraineeRoutes = () => {
    const { redirect, path } = useUserAuthorization("User");

    if (redirect) return <Redirect to={path} />;

    return (
        <>
            {/* <HorizontalNavbar />
            <VerticalNavbar VerticalNavbarData={verticalTrainee} /> */}
            <Switch>
                <Route path="/trainee/dashboard" exact>
                    {/* Tu */}
                    <DashBoard />
                </Route>

                <Route path="*" exact>
                    {/* Not assigned */}
                    <Redirect to="/trainee/dashboard" />
                </Route>
            </Switch>
        </>
    );
};

export default TraineeRoutes;
