import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Inicio = () => {
  const rol = useSelector((store) => store.usuario.rol);

  switch (rol) {
    case "ODONTOLOGO":
      return <Navigate to="/InicioOdontologo" />;
    case "ADM":
      return <Navigate to="/inicio-adm" />;
    // case "ASISTENTE":
    case "ASISTENTE":
      return <Navigate to="/inicio-asistente" />;
    //   return <Navigate to="/inicio-asistente" />;
     case "PACIENTE":
      return <Navigate to="/inicio-paciente" />;
    // case "AUXILIAR":
    //   return <Navigate to="/inicio-auxiliar" />;
    default:
      return <Navigate to="/" />;
  }
};
