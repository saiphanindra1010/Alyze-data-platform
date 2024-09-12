import { createBrowserRouter } from "react-router-dom";
import APP from "./App";

import Notfound  from "./pages/notfound";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home.jsx";
import Login from "./pages/Login";
import Reportslist from "./pages/reportslist";
const router = createBrowserRouter(
    [

        {
            path: "/",
            element: <APP />
        },
        {
            path: "/dashboard",
            element: <Dashboard />
        },
        {
            path: "/home",
            element: <Home />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/reportslist",
            element: < Reportslist/>
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router