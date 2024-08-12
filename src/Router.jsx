import { createBrowserRouter } from "react-router-dom";
import APP from "./App";
import Pricing from "./pages/pricing";
import Notfound  from "./pages/notfound";
import Tickets from "./pages/tickets";
import Dashboard from "./pages/dashboard";
const router = createBrowserRouter(
    [

        {
            path: "/",
            element: <APP />
        },
        {
            path: "/pricing",
            element: <Pricing />
        },
        {
            path: "/tickets",
            element: <Tickets />
        },
        {
            path: "/dashboard",
            element: <Dashboard />
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router