import { createBrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Notfound from "./pages/notfound";
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
import Layout from "./components/layout/layout"
// This is the router component where we manage authentication state and routes
const Router = () => {
  // Initialize state for authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status from localStorage when component mounts
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Token found:', token);
        setIsAuthenticated(true);
      }
    };

    checkToken(); // Initial check
    const interval = setInterval(checkToken, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup
  }, []);

  // Create router configuration dynamically based on the authentication state
  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
    },

    {
      path: "/",
      element: <Layout />, children: [
        {
          path: "/home",
          element: <ErrorBoundary><AuthRoute element={Reportslist} isAuthenticated={isAuthenticated} /></ErrorBoundary>
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
          path: "/talktodb",
          element: <AuthRoute element={Dbchat} isAuthenticated={isAuthenticated} />
        },
        {
          path: "/profile",
          element: <ErrorBoundary><AuthRoute element={Profile} isAuthenticated={isAuthenticated} /></ErrorBoundary>
        },
        {
          path: "/filechat",
          element: <AuthRoute element={Filechat} isAuthenticated={isAuthenticated} />
        },
        {
          path: "/analyze",
          element: <AuthRoute element={Analyzereport} isAuthenticated={isAuthenticated} />
        },
      ]
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />,
    },

    {
      path: "*",
      element: <Notfound />
    }
  ]);

  return router;
};

export default Router;
