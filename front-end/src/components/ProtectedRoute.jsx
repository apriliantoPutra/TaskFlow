import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ message: "Harus login terlebih dahulu", type: "error" }} />;
  }
  return children;
};
export default ProtectedRoute;
