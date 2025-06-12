import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/login";
//import { Page404 } from "../pages/Page404";
import { PrivateRoutes } from "./PrivateRoutes";
// Rutas centrales por rol (redirige desde /inicio)
import { Inicio } from "../pages/Inicio/Inicio";
import { InicioOdontologo } from "../pages/Inicio/InicioOdontologo";
import { InicioPaciente } from "../pages/Inicio/InicioPaciente";
import { Register } from "../pages/Register";
//import { InicioAsistente } from "../pages/asistente/InicioAsistente";
//import { InicioAuxiliar } from "../pages/auxiliar/InicioAuxiliar";
import { InicioAdm } from "../pages/Inicio/InicioAdm";
import { AsignarTurnoPage } from "../pages/adm/asistencia/AsignarTurnosPage";
import { EmpleadosPage } from "../pages/adm/empleado/EmpleadosPage";
import { PacientesPage } from "../pages/adm/paciente/PacientesPage";
import { TurnosPage } from "../pages/adm/turno/TurnosPage";
//import { HistorialClinicoPage } from "../pages/adm/historial/HistorialClinicoPage";
import { RegistrarHistorialClinicoPage } from "../pages/adm/paciente/historial-clinico/RegistrarHistorialClinico";
import { HistoriasClinicoPage } from "../pages/adm/paciente/historial-clinico/HistoriasClinicoPage";
import { HistorialClinicoPacientePage } from "../pages/adm/paciente/historial-clinico/HistorialClinicoPacientePage";
import { DetalleOdontogramaPage } from "../pages/adm/paciente/odontograma/DetalleOdontogramaPage";
import { OdontogramaPacientePage } from "../pages/adm/paciente/odontograma/OdontogramaPacientePage";
import { DetalleDientePage } from "../pages/adm/paciente/odontograma/DetalleDientePage";
import { RegistrarOdontogramaPage } from "../pages/adm/paciente/odontograma/RegistrarOdontogramaPage";
import { ReservarCitaPage } from "../pages/paciente/cita/ReservarCitaPage";
import { CitaPageAdm } from "../pages/adm/cita/CitaPageAdm";



export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ruta central que redirige según el rol */}
      <Route
        path="/inicio"
        element={
          <PrivateRoutes roles={["ODONTOLOGO", "ASISTENTE", "PACIENTE", "AUXILIAR", "ADM"]}>
            <Inicio />
          </PrivateRoutes>
        }
      />


      <Route element={<PrivateRoutes roles={["ADM"]} />}>
        <Route path="/inicio-adm" element={<InicioAdm />} />
        <Route path="/asistencia/asignarTurno/:idEmpleado" element={<AsignarTurnoPage />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/pacientes/:idPaciente/historial/nuevo" element={<RegistrarHistorialClinicoPage />} />
        <Route
          path="/pacientes/:idPaciente/historial"
          element={<HistoriasClinicoPage />}
        />
        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial"
          element={<HistorialClinicoPacientePage />}
        />

        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma"
          element={<OdontogramaPacientePage />}
        />
        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/:idOdontograma/detalle/:idDetalle"
          element={<DetalleOdontogramaPage />}
        />
        <Route path="/citas" element={<CitaPageAdm />} />

        {/* Ver un diente concreto */}
        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/:idOdontograma/detalle/:idDetalle"
          element={<DetalleDientePage />}
        />

        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/nuevo"
          element={<RegistrarOdontogramaPage />}
        />
        {/* <Route path="/pacientes/:idPaciente/historial" element={<HistorialClinicoPage />} /> */}
        {/*  rutas hijas del admin */}
        {/* <Route path="/empleados" element={<EmpleadosList />} />
        <Route path="/turnos" element={<TurnosList />} />
        <Route path="/pacientes" element={<PacientesList />} />
        <Route path="/servicios" element={<ServiciosList />} /> */}
      </Route>

      <Route element={<PrivateRoutes roles={["ODONTOLOGO"]} />}>
        <Route path="/InicioOdontologo" element={<InicioOdontologo />} />
        <Route path="/pacientes" element={<PacientesPage />} />
      </Route>


      <Route element={<PrivateRoutes roles={["PACIENTE"]} />}>
        <Route path="/inicio-paciente" element={<InicioPaciente />} />
         <Route path="/reservar-cita" element={<ReservarCitaPage />} />
      </Route>


      {/* <Route element={<PrivateRoutes roles={["ASISTENTE"]} />}>
        <Route path="/inicio-asistente" element={<InicioAsistente />} />
      </Route>



      <Route element={<PrivateRoutes roles={["AUXILIAR"]} />}>
        <Route path="/inicio-auxiliar" element={<InicioAuxiliar />} />
      </Route>

      <Route path="*" element={<Page404 />} /> */}
    </Routes>
  );
};
