import jwtDecode from "jwt-decode";

import { LOGIN, LOGOUT } from "../action";

const user = getUser();

const userReducer = (state = user, action) => {
    switch (action.type) {
        case LOGIN: {
            return action.payload;
        }

        case LOGOUT: {
            return null;
        }

        default:
            return state;
    }
};

export default userReducer;

function getUser() {
    let data = localStorage.getItem("accessToken");

    // Don't have token
    if (!data) return null;

    // Decode token to check expiration time
    let decodedToken = jwtDecode(data);

    // Expired token
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("life");
        return null;
    }

    // Get user data from local storage
    return JSON.parse(localStorage.getItem("life"));
}
