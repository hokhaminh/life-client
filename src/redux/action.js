export const LOGIN = "user/login";
export const LOGOUT = "user/logout";

export const login = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem(
        "life",
        JSON.stringify({
            userId: data.accountId,
            fullname: data.fullname,
            role: data.role,
            username: data.username,
            email: data.email,
        })
    );

    return {
        type: LOGIN,
        payload: {
            userId: data.accountId,
            fullname: data.fullname,
            role: data.role,
            username: data.username,
            email: data.email,
        },
    };
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("life");

    return {
        type: LOGOUT,
    };
};
