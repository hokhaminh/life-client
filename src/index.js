import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log(`                       
Created by KhaMinhHo | 2022 | v1.0.0              
https://www.fb.com/khaminhho6/               
                               
                                @@        @    @@@@
                                @@    @@  @    @@                                  
                                @@    @@  @    @@                               
                                @@@@  @@  @@@  @@@@           `);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
