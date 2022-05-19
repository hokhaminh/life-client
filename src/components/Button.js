import React from "react";
import "../styles/Button.css";

const Button = ({
    children,
    btn = "blue",
    style = {},
    className = "",
    onClick = () => {},
}) => {
    return (
        <button
            className={`myButton  ${className}`}
            style={{
                ...buttonOptions[btn],
                ...style,
            }}
            onClick={onClick}
            type="submit"
        >
            {children}
        </button>
    );
};

export default Button;
const buttonOptions = {
    blue: {
        backgroundColor: "var(--color-blue)",
    },
    dark_blue: {
        backgroundColor: "var(--color-dark-blue)",
    },
    super_light_blue: {
        backgroundColor: "var(--color-super-light-blue)",
        color: "var(--color-light-blue)",
    },
    alert: {
        backgroundColor: "var(--color-pink)",
    },
};
