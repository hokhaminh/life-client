import { useFormik } from "formik";
import React from "react";
import PageWrapper from "../../components/PageWrapper";
import * as Yup from "yup";
import { useLazyFetch } from "../../utils/useFetch";
import { API } from "../../utils/constant";
import "../../styles/Authentication/Register.css";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Register = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            fullname: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Username is required")
                .min(6, "Username must be at least 3 characters")
                .max(20, "Username must be at most 20 characters"),
            email: Yup.string()
                .required("Email is required")
                .email("Email is invalid"),
            fullname: Yup.string()
                .required("Fullname is required")
                .min(3, "Fullname must be at least 3 characters")
                .max(50, "Fullname must be at most 20 characters"),
            phone: Yup.string().required("Phone is required"),
            password: Yup.string().required("Password is required"),
            confirmPassword: Yup.string()
                .required("Confirm Password is required")
                .oneOf([Yup.ref("password"), null], "Password must match"),
        }),
        onSubmit: () => {
            fetchData();
        },
    });

    const [fetchData, { loading }] = useLazyFetch(`${API}/auth/register`, {
        method: "post",
        body: {
            username: formik.values.username,
            email: formik.values.email,
            fullname: formik.values.fullname,
            phone: formik.values.phone,
            password: formik.values.password,
            confirmPassword: formik.values.confirmPassword,
        },
        onCompleted: () => {
            navigate("/login");
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Register failed!",
                text: error,
            });
        },
    });

    return (
        <PageWrapper className="d-flex justify-content-center align-items-center">
            {loading && <Loading />}
            <div className="register_container">
                <h1>Sign up</h1>
                <p>Create an Account to Create a memorial</p>

                <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex">
                        <div className="register_inputs">
                            {/* Username */}
                            <input
                                type="text"
                                placeholder="Username"
                                id="username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.username &&
                            formik.touched.username ? (
                                <p className="text-danger">
                                    {formik.errors.username}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}
                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.email && formik.touched.email ? (
                                <p className="text-danger">
                                    {formik.errors.email}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}

                            {/* Password */}
                            <input
                                type="password"
                                placeholder="Password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.password &&
                            formik.touched.password ? (
                                <p className="text-danger">
                                    {formik.errors.password}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}
                        </div>
                        <div className="register_inputs">
                            {/* Fullname */}
                            <input
                                type="text"
                                placeholder="Full name"
                                id="fullname"
                                name="fullname"
                                value={formik.values.fullname}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.fullname &&
                            formik.touched.fullname ? (
                                <p className="text-danger">
                                    {formik.errors.fullname}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}

                            {/* Phone */}
                            <input
                                type="text"
                                placeholder="Phone"
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.phone && formik.touched.phone ? (
                                <p className="text-danger">
                                    {formik.errors.phone}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}

                            {/* Confirm Password */}
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.confirmPassword &&
                            formik.touched.confirmPassword ? (
                                <p className="text-danger">
                                    {formik.errors.confirmPassword}
                                </p>
                            ) : (
                                <p className="invisible">-</p>
                            )}
                        </div>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                            required
                        />
                        <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                        >
                            I agree to the Tearms and Privacy Policy
                        </label>
                    </div>
                    <button
                        className="register_btn d-flex justify-content-center"
                        type="submit"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </PageWrapper>
    );
};

export default Register;
