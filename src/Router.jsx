import { createBrowserRouter } from "react-router-dom";

import Notfound  from "./pages/notfound";
import Dashboard from "./pages/dashboard";



import Login from "./pages/Login";
import Reportslist from "./pages/reportslist";
import AuthRoute from "./components/authroute/authroute";
import { Navigate } from "react-router-dom";
import Connections from "./pages/connections.jsx";
import Dbchat from "./pages/dbchat";
import Profile from "./pages/profile";
import Filechat from "./pages/filechat";
import Analyzereport from "./pages/Analyzereport.jsx";
import ErrorBoundary from "./pages/ErrorBoundary";
const token = localStorage.getItem('token');
const isAuthenticated = !!token; 
console.log("is auth  "+isAuthenticated)
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
            element:  <ErrorBoundary><AuthRoute element={Reportslist} isAuthenticated={isAuthenticated} /></ErrorBoundary>
        },
        {
            path: "/login",
            element:  isAuthenticated ? <Navigate to="/home" /> : <Login/>,
        },
        // {
        //     path: "/reportslist",
        //     element: <AuthRoute element={Reportslist} isAuthenticated={isAuthenticated} />
        // },
        {
            path:"/talktodb",
            element:<AuthRoute element={Dbchat} isAuthenticated={isAuthenticated}/>
        },
        {
            path:"/profile",
            element:<ErrorBoundary><AuthRoute element={Profile} isAuthenticated={isAuthenticated}/></ErrorBoundary> 
        },
        {
            path:"/filechat",
            element:<AuthRoute element={Filechat} isAuthenticated={isAuthenticated}/>
        },
        {
            path:"/analyze",
            element:<AuthRoute element={Analyzereport} isAuthenticated={isAuthenticated}/>
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router