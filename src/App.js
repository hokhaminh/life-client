// Libs
import { BrowserRouter } from "react-router-dom";

// Files
import "./App.css";
import MainRoute from "./routes/MainRoutes";

function App() {
    return (
        <div>
            <BrowserRouter>
                <MainRoute />
            </BrowserRouter>
        </div>
    );
}

export default App;
