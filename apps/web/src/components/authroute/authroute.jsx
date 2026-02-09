import { Navigate } from "react-router-dom";
import { useAuth } from "../../stores/authStore";

const authroute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  console.log("AuthRoute: isAuthenticated:", isAuthenticated);
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default authroute;
