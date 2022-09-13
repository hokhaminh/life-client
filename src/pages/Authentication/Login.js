import React from "react";
import PageWrapper from "../../components/PageWrapper";
import "../../styles/Authentication/Login.css";
import Loading from "../../components/Loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLazyFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: () => {
            fetchData();
        },
    });
    const [fetchData, { loading }] = useLazyFetch(`${API}/auth/login`, {
        method: "post",
        body: {
            username: formik.values.username,
            password: formik.values.password,
        },
        onCompleted: (data) => {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem(
                "life",
                JSON.stringify({
                    userId: data.userId,
                    fullname: data.fullname,
                    role: data.role,
                    username: data.username,
                    email: data.email,
                })
            );
        },
        onError: (error) => {
            Swal.fire({
                title: "Login failed!",
                text: "Wrong username or password",
                icon: "error",
                confirmButtonText: "Try again",
                confirmButtonColor: "#445279",
            });
        },
        finally: () => {
            navigate("/");
        },
    });
    return (
        <PageWrapper className="d-flex justify-content-center align-items-center">
            {loading && <Loading />}
            <div className="login_container">
                <h1>Login</h1>
                <p>Welcome to LIFE, please login first</p>
                <form onSubmit={formik.handleSubmit}>
                    <div className="login_inputs d-flex flex-column justify-content-center ">
                        <input
                            type="text"
                            // placeholder="Username"
                            id="username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.username && formik.touched.username && (
                            <p className="text-danger ms-3">
                                {formik.errors.username}
                            </p>
                        )}
                        <input
                            type="password"
                            // placeholder="Password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.password && formik.touched.password && (
                            <p className="text-danger ms-3">
                                {formik.errors.password}
                            </p>
                        )}
                        <button className="login_btn" type="submit">
                            Login
                        </button>
                    </div>
                </form>
                <div className=" mt-3 d-flex flex-column justify-content-center align-items-center">
                    <p>
                        If You Don't Have An Account,{" "}
                        <strong>Create One</strong>
                    </p>
                    <button
                        className="register_btn2"
                        onClick={() => {
                            navigate("/register");
                        }}
                    >
                        Register
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Login;
