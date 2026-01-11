import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";
import App from "./App.jsx";
const env = import.meta.env;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={env.VITE_CLIENTID}>
        {/* <RouterProvider router={router} /> */}
        <App/>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
