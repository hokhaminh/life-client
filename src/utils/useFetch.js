import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "./constant";

axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        var token = localStorage.getItem("accessToken");
        config.headers.Authorization = token ? `Bearer ${token}` : "";
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * Callback to handle after the request is completed
 *
 * @callback onCompletedCallback
 * @param {Object} result - fetch result
 */

/**
 * Callback to handle if the request is error
 *
 * @callback onErrorCallback
 * @param {Object} error - error
 */

/**
 * Auto fetch data when Component is mount
 *
 * @param {string} url - endpoint to send request
 * @param {Object} options - options to fetch
 * @param {string} options.method - method to fetch
 * @param {Object} options.body - body to send
 * @param {onCompletedCallback} options.onCompleted - the callback to handle after the request is completed
 * @param {onErrorCallback} options.onError - the callback to handle if error occured
 * @returns {Object} - loading, data, error
 */
export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    let history = useNavigate();

    useEffect(() => {
        if (!url) return;
        handleFetch(url, options, setData, setError, setLoading, history);
    }, []);

    return { loading, data, error };
};

/**
 * Return a function to fetch data when called
 *
 * @param {string} url - endpoint to send request
 * @param {Object} options - options to fetch
 * @param {string} options.method - method to fetch
 * @param {Object} options.body - body to send
 * @param {onCompletedCallback} options.onCompleted - the callback to handle after the request is completed
 * @param {onErrorCallback} options.onError - the callback to handle if error occured
 * @returns {Object} - function to fetch, loading, data, error
 */
export const useLazyFetch = (url, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    let history = useNavigate();

    async function fetchData(urlParam = "", optionsParam = {}) {
        setLoading(true);

        // If passing new url and options => get the later
        const newOptions = {
            ...options,
            ...optionsParam,
        };

        const newUrl = urlParam || url;

        handleFetch(newUrl, newOptions, setData, setError, setLoading, history);
    }

    return [fetchData, { loading, data, error }];
};

async function handleFetch(
    url,
    options = {},
    setData,
    setError,
    setLoading,
    history
) {
    try {
        // Try to fetch data
        const response = await axios(url, { ...options, data: options.body });

        setData(response.data);

        options.onCompleted && options.onCompleted(response.data);
        setError(undefined);
        setLoading(false);

        // Finally
        options.finally && options.finally(response.data);
    } catch (error) {
        // If status is 401 - UNAUTHORIZED => try to refresh token and refetch
        if (error.response && error.response.status === 401) {
            try {
                // Refresh token
                await refreshToken(history);
                // Refetch
                await handleFetch(url, options, setData, setError, setLoading);
            } catch (err) {
                setError(error.response.data);
                setData(undefined);
                options.onError && options.onError(error.response.data);
                setLoading(false);
            }
        } else if (error.response) {
            setError(error.response.data);
            setData(undefined);
            options.onError && options.onError(error.response.data);
            setLoading(false);
        }
    }
}

async function refreshToken(history) {
    try {
        const res = await axios.post(`${API}/token/refresh`);

        localStorage.setItem("accessToken", res.data.accessToken);
    } catch (error) {
        history.push({
            pathname: "/logout",
            state: {
                logout: "logout",
            },
        });
    }
}
