import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../../store/slices/authSlice";

function BloggerRoute({ children, requiredRole = "BLOGGER" }) {
  const user = useSelector(selectCurrentUser);
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default BloggerRoute;
