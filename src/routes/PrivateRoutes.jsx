import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = ({ roles, redirectTo = "/", children }) => {
  const usuario = useSelector((store) => store.usuario);
   if (usuario?.token && roles.includes(usuario?.rol)) {
    return children ? children : <Outlet />
  }

  return <Navigate to={redirectTo} />;
};
