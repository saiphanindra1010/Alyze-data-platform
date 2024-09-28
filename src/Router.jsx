import { createBrowserRouter } from "react-router-dom";

import Notfound  from "./pages/notfound";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home.jsx";
import Login from "./pages/Login";
import Reportslist from "./pages/reportslist";
import AuthRoute from "./components/authroute/authroute";
import { Navigate } from "react-router-dom";
import Connections from "./pages/connections.jsx";
import Dbchat from "./pages/dbchat";

const token = localStorage.getItem('token');
const isAuthenticated = !!token; 
console.log(isAuthenticated)
// const isAuthenticated = true
const router = createBrowserRouter(
    [

        {
            path: "/",
            element: isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />,
        },
        {
            path: "/connections",
            element: <AuthRoute element={Connections} isAuthenticated={isAuthenticated} />
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
            path:"/talktodb",
            element:<AuthRoute element={Dbchat} isAuthenticated={isAuthenticated}/>
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router