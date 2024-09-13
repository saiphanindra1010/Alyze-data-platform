import { createBrowserRouter } from "react-router-dom";
import APP from "./App";

import Notfound  from "./pages/notfound";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home.jsx";
import Login from "./pages/Login";
import Reportslist from "./pages/reportslist";
import AuthRoute from "./components/authroute/authroute";
import { Navigate } from "react-router-dom";
const isAuthenticated = true
const router = createBrowserRouter(
    [

        {
            path: "/",
            element: isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
        },
        {
            path: "/dashboard",
            element: <AuthRoute element={Dashboard} isAuthenticated={isAuthenticated} />
        },
        {
            path: "/home",
            element:  <AuthRoute element={Home} isAuthenticated={isAuthenticated} />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/reportslist",
            element: <AuthRoute element={Reportslist} isAuthenticated={isAuthenticated} />
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router