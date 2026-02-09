import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Notfound from "./pages/notfound";
import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import Reportslist from "./pages/reportslist";
import Connections from "./pages/connections.jsx";
import Dbchat from "./pages/dbchat";
import Profile from "./pages/profile";
import Filechat from "./pages/filechat";
import Analyzereport from "./pages/Analyzereport.jsx";
import ErrorBoundary from "./pages/ErrorBoundary";
import Layout from "./components/layout/layout";
import { useAuth } from "./stores/authStore";

// Protected route wrapper
function ProtectedRoute({ component: Component }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Component />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <ProtectedRoute component={Dashboard} />,
      },
      {
        path: "/home",
        element: (
          <ErrorBoundary>
            <ProtectedRoute component={Reportslist} />
          </ErrorBoundary>
        ),
      },
      {
        path: "/connections",
        element: <ProtectedRoute component={Connections} />,
      },
      {
        path: "/talktodb",
        element: <ProtectedRoute component={Dbchat} />,
      },
      {
        path: "/profile",
        element: (
          <ErrorBoundary>
            <ProtectedRoute component={Profile} />
          </ErrorBoundary>
        ),
      },
      {
        path: "/filechat",
        element: <ProtectedRoute component={Filechat} />,
      },
      {
        path: "/analyze",
        element: <ProtectedRoute component={Analyzereport} />,
      },
    ]
  },
  {
    path: "*",
    element: <Notfound />
  }
]);

// Root route - just redirect based on current auth state
function RootRoute() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
