import { useContext } from "react";
import { mainContext, type mainContextProps } from "../../context/MainProvider";
import { Navigate } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading } = useContext(mainContext) as mainContextProps;

  if (loading) {
    return <div>Loading....</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
