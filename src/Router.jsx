import { createBrowserRouter } from "react-router-dom";
import APP from "./App";
import CONTACTS  from "./pages/contacts";
import Notfound  from "./pages/notfound";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <APP />
        },
        {
            path: "/contacts",
            element: <CONTACTS />
        },
        {
            path: "*",
            element: <Notfound />
        }
    ]
);

export default router