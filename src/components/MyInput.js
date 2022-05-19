import React from "react";
import "../styles/MyInput.css";
const MyInput = ({
    label,
    name,
    onChange = {},
    value = {},
    errorMessage,
    errorTouched,
    type,
    placeholder,
    className = "",
}) => {
    return (
        <span className={className}>
            <label htmlFor={name} className="d-block ms-3 mb-1">
                {label}
            </label>
            <input
                className="input_create_post"
                type={type}
                id={name}
                value={value}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
            />
            {errorMessage && errorTouched && (
                <p className="text-danger">{errorMessage}</p>
            )}
        </span>
    );
};

export default MyInput;
