// Libs
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useAuthentication } from "utils/useAuthorization";

import Login from "../pages/Authentication/Login";
import RecoverPassword from "../pages/Authentication/RecoverPassword";

const AuthRoutes = () => {
    const { redirect, path } = useAuthentication();

    if (redirect) return <Redirect to={path} />;

    return (
        <Switch>
            <Route path="/recover" exact>
                {/* Long */}
                {/* <RecoverPassword /> */}
            </Route>

            <Route path="/">
                {/* Phúc */}
                <Login />
            </Route>
        </Switch>
    );
};

export default AuthRoutes;
