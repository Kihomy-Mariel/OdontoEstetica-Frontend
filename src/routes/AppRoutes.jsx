import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/Login";
import { PrivateRoutes } from "./PrivateRoutes";
import { Inicio } from "../pages/Inicio/Inicio";
import { InicioOdontologo } from "../pages/Inicio/InicioOdontologo";
import { InicioPaciente } from "../pages/Inicio/InicioPaciente";
import { Register } from "../pages/Register";
import { InicioAsistente } from "../pages/Inicio/InicioAsistente";

import { InicioAdm } from "../pages/Inicio/InicioAdm";
import { AsignarTurnoPage } from "../pages/adm/asistencia/AsignarTurnosPage";
import { EmpleadosPage } from "../pages/adm/empleado/EmpleadosPage";
import { PacientesPage } from "../pages/adm/paciente/PacientesPage";
import { TurnosPage } from "../pages/adm/turno/TurnosPage";
import { RegistrarHistorialClinicoPage } from "../pages/adm/paciente/historial-clinico/RegistrarHistorialClinico";
import { HistoriasClinicoPage } from "../pages/adm/paciente/historial-clinico/HistoriasClinicoPage";
import { HistorialClinicoPacientePage } from "../pages/adm/paciente/historial-clinico/HistorialClinicoPacientePage";
import { DetalleOdontogramaPage } from "../pages/adm/paciente/odontograma/DetalleOdontogramaPage";
import { OdontogramaPacientePage } from "../pages/adm/paciente/odontograma/OdontogramaPacientePage";
import { DetalleDientePage } from "../pages/adm/paciente/odontograma/DetalleDientePage";
import { RegistrarOdontogramaPage } from "../pages/adm/paciente/odontograma/RegistrarOdontogramaPage";
import { ReservarCitaPage } from "../pages/paciente/cita/ReservarCitaPage";
import { ServiciosPageAdm } from "../pages/adm/servicio/ServiciosPageAdm";
import { EditarServicioPageAdm } from "../pages/adm/servicio/EditarServicioPageAdm";
import { RegistrarServicioAdm } from "../pages/adm/servicio/RegistrarServicioAdm";
import { PagosPageAdm } from "../pages/adm/pago/PagosPageAdm";
import { CitasPageAdm } from "../pages/adm/cita/CitasPageAdm";
import { ProductoPageAdm } from "../pages/adm/producto/ProductoPageAdm";
import { RegistrarPacientePage } from "../pages/adm/paciente/RegistrarPacientePage";
import { ActualizarPacientePage } from "../pages/adm/paciente/ActualizarPacientePage";
import { RegistrarEmpleadoPage } from "../pages/adm/empleado/RegistrarEmpleadoPage";
import { EditarEmpleadoPage } from "../pages/adm/empleado/EditarEmpleadoPage";
import { EmpleadoServicioPage } from "../pages/adm/empleado/EmpleadoServicioPage";
import { ProveedorPage } from "../pages/adm/proveedor/ProveedorPage";
import { RegistrarProveedorPage } from "../pages/adm/proveedor/RegistrarProveedorPage";
import { EditarProveedorPage } from "../pages/adm/proveedor/EditarProveedorPage";
import { RegistrarProductoPageAdm } from "../pages/adm/producto/RegistrarProductoPageAdm";
import { RegistrarTurnoPage } from "../pages/adm/turno/RegistrarTurnoPage";
import { ActualizarTurnoPage } from "../pages/adm/turno/ActualizarTurnoPage";
import { CompraPage } from "../pages/adm/compra/CompraPage";
import { NuevaCompraPage } from "../pages/adm/compra/NuevaCompraPage";
import { ServiciosPacientePage } from "../pages/paciente/servicios/serviciosPage";
import { HorariosDoctoresPage } from "../pages/paciente/horario/horariosDoctores";
import { ActualizarProductoPageAdm } from "../pages/adm/producto/ActualizarProductoPageAdm";
import { RegistrarCompraPage } from "../pages/adm/compra/RegistrarCompraPage";
import { RegistrarEmpleadoServicioPage } from "../pages/adm/empleado/RegistrarEmpleadoServicio";
import { RegistrarCitaPageAdm } from "../pages/adm/cita/RegistrarCitaPageAdm";
import { RegistrarPagoPageAdm } from "../pages/adm/pago/RegistrarPagoPageAdm";
import { VerPagoPageAdm } from "../pages/adm/pago/VerPagoPageAdm";
import { VerReciboPage } from "../pages/adm/recibo/VerReciboPage";

// Rutas asistente
import { PacientesPageAsist } from "../pages/asistente/pacientes/PacientesPageAsist";
import { RegistrarPacientePageAsist } from "../pages/asistente/pacientes/RegistrarPacientePageAsist";
import { ActualizarPacientePageAsist } from "../pages/asistente/pacientes/ActualizarPacientePageAsist";
import { PagoForm } from "../pages/asistente/pagos/PagoForm";
import { CitasPageAsist } from "../pages/asistente/citas/CitasPageAsist";
import { CitaForm } from "../pages/asistente/citas/CitaForm";
import { PagosPageAsist } from "../pages/asistente/pagos/PagosPageAsist";
import { VerPagoPageAsist } from "../pages/asistente/pagos/VerPagoPageAsist";
import { ServiciosPageAsist } from "../pages/asistente/servicios/ServiciosPageAsist";
import { RegistrarServicioAsist } from "../pages/asistente/servicios/RegistrarServicioPageAsist";
import { EditarServicioPageAsist } from "../pages/asistente/servicios/EditarServicioPageAsist";
import { VerReciboPageAsist } from "../pages/asistente/recibos/VerReciboPageAsist";
import { RecibosPageAsist } from "../pages/asistente/recibos/RecibosPageAsist";
import { TurnosPageAsist } from "../pages/asistente/turnos/TurnosPageAsist";
import { RegistrarTurnoPageAsist } from "../pages/asistente/turnos/RegistrarTurnoPageAsist";
import { ActualizarTurnoPageAsist } from "../pages/asistente/turnos/ActualizarTurnoPageAsist";
import { OdontologosPage } from "../pages/paciente/odontologo/odontologosPage";
import { OdontologoServiciosPage } from "../pages/paciente/odontologo/OdontologoServiciosPage";
import { UsuariosPageAdm } from "../pages/adm/usuario/UsuariosPageAdm";
import { PagosPacientePage } from "../pages/paciente/pago/PagosPacientePage";
import { VerPagoPacientePage } from "../pages/paciente/pago/VerPagoPacientePage";
import { VerReciboPacientePage } from "../pages/paciente/pago/VerReciboPacientePage";
import {GenerarRecibo} from "../pages/adm/recibo/GenerarRecibo";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/inicio"
        element={
          <PrivateRoutes roles={["ODONTOLOGO", "ASISTENTE", "PACIENTE", "AUXILIAR", "ADM"]}>
            <Inicio />
          </PrivateRoutes>
        }
      />

      {/* RUTAS ADM */}
      <Route element={<PrivateRoutes roles={["ADM", "ODONTOLOGO"]} />}>
        <Route path="/inicio-adm" element={<InicioAdm />} />
        <Route path="/asistencia/asignarTurno/:idEmpleado" element={<AsignarTurnoPage />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/empleados/editar/:idEmpleado" element={<EditarEmpleadoPage />} />
        <Route path="/empleados/:idEmpleado/servicios" element={<EmpleadoServicioPage />} />
        <Route path="/empleados/:idEmpleado/registrar-servicio" element={<RegistrarEmpleadoServicioPage />} />
        <Route path="/registrar-empleado" element={<RegistrarEmpleadoPage />} />
        <Route path="/proveedores" element={<ProveedorPage />} />
        <Route path="/proveedores/registrar" element={<RegistrarProveedorPage />} />
        <Route path="/proveedores/editar/:id" element={<EditarProveedorPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/turno/nuevo" element={<RegistrarTurnoPage />} />
        <Route path="/turno/editar/:idTurno" element={<ActualizarTurnoPage />} />
        <Route path="/servicios" element={<ServiciosPageAdm />} />
        <Route path="/servicios/nuevo" element={<RegistrarServicioAdm />} />
        <Route path="/servicios/:id/editar" element={<EditarServicioPageAdm />} />
        <Route path="/pacientes/:idPaciente/historial/nuevo" element={<RegistrarHistorialClinicoPage />} />
        <Route path="/pacientes/:idPaciente/historial" element={<HistoriasClinicoPage />} />
        <Route path="/pacientes/:idPaciente/historial/:idHistorial" element={<HistorialClinicoPacientePage />} />
        <Route path="/pacientes/:idPaciente/historial/:idHistorial/odontograma" element={<OdontogramaPacientePage />} />
        <Route path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/:idOdontograma/detalle/:idDetalle" element={<DetalleOdontogramaPage />} />
        <Route path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/:idOdontograma/detalle/:idDetalle" element={<DetalleDientePage />} />
        <Route path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/nuevo" element={<RegistrarOdontogramaPage />} />
        <Route path="/productos" element={<ProductoPageAdm />} />
        <Route path="/productos/nuevo" element={<RegistrarProductoPageAdm />} />
        <Route path="/productos/editar/:id" element={<ActualizarProductoPageAdm />} />
        <Route path="/registrar-pacientes" element={<RegistrarPacientePage />} />
        <Route path="/pacientes/:idPaciente/editar" element={<ActualizarPacientePage />} />

        <Route
          path="/turno/editar/:idTurno"
          element={<ActualizarTurnoPage />}
        />
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
        {/* Ver un diente concreto */}
        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/:idOdontograma/detalle/:idDetalle"
          element={<DetalleDientePage />}
        />
        <Route
          path="/pacientes/:idPaciente/historial/:idHistorial/odontograma/nuevo"
          element={<RegistrarOdontogramaPage />}
        />

        <Route
          path="/citas"
          element={<CitasPageAdm />}
        />

        <Route
          path="/productos"
          element={<ProductoPageAdm />}
        />
        <Route path="/productos/nuevo"
          element={<RegistrarProductoPageAdm />}
        />
        <Route
          path="/productos/editar/:id"
          element={<ActualizarProductoPageAdm />}
        />


        <Route path="/pagos" element={<PagosPageAdm />} />
        <Route path="/citas" element={<CitasPageAdm />} />
        <Route path="/compras" element={<CompraPage />} />
        <Route path="/compras/registrar" element={<NuevaCompraPage />} />
        <Route path="/cita-nueva" element={<RegistrarCitaPageAdm />} />
        <Route path="/registrar-pago" element={<RegistrarPagoPageAdm />} />
        <Route path="/ver-pago/:idPago" element={<VerPagoPageAdm />} />
        <Route path="/ver-recibo/:idRecibo" element={<VerReciboPage />} />
        <Route path="/usuarios" element={<UsuariosPageAdm />}/>
        <Route path="/generar-recibo/:idPago" element={<GenerarRecibo />} />
      </Route>

      {/* RUTAS ASISTENTE */}
      <Route element={<PrivateRoutes roles={["ASISTENTE"]} />}>
        <Route path="/inicio-asistente" element={<InicioAsistente />} />
        <Route path="/asistente/pacientes" element={<PacientesPageAsist />} />
        <Route path="/registrar-pacientes-asist" element={<RegistrarPacientePageAsist />} />
        <Route path="/pacientes/:idPaciente/editar/asist" element={<ActualizarPacientePageAsist />} />

        <Route path="/asistente/pagos" element={<PagoForm />} />
        <Route path="/asistente/registrar-pago" element={<PagosPageAsist />} />
        <Route path="/asistente/pagos" element={<VerPagoPageAsist />} />


        <Route path="/asistente/citas" element={<CitasPageAsist />} />
        <Route path="/asistente/cita-nueva" element={<CitaForm />} />

        <Route path="/asistente/servicios" element={<ServiciosPageAsist />} />
        <Route path="/asistente/servicios/nuevo" element={<RegistrarServicioAsist />} />
        <Route path="/asistente/servicios/:id/editar" element={<EditarServicioPageAsist />} />

        <Route path="/asistente/ver-recibo/:idRecibo" element={<VerReciboPageAsist />} />
        <Route path="/asistente/recibos" element={<RecibosPageAsist />} />

        <Route path="/asistente/turnos" element={<TurnosPageAsist />} />
        <Route path="/turno/nuevo" element={<RegistrarTurnoPageAsist />} />
        <Route path="/turno/editar/:idTurno" element={<ActualizarTurnoPageAsist />} />
        <Route
          path="/compras"
          element={<CompraPage />}
        />

        <Route
          path="/productos/editar/:id" element={<ActualizarProductoPageAdm />}
        />

        <Route
          path="/compras/registrar"
          element={<RegistrarCompraPage />}
        />
        <Route
          path="/empleados/:idEmpleado/registrar-servicio"
          element={<RegistrarEmpleadoServicioPage />}
        />

        <Route
          path="/cita-nueva"
          element={<RegistrarCitaPageAdm />}
        />



        <Route
          path="/registrar-pago"
          element={<RegistrarPagoPageAdm />}
        />

        <Route
          path="/ver-pago/:idPago"
          element={<VerPagoPageAdm />}
        />

        <Route
          path="/ver-recibo/:idRecibo"
          element={<VerReciboPage />}
        />



      </Route>

      {/* RUTAS ODONTOLOGO */}
      <Route element={<PrivateRoutes roles={["ODONTOLOGO"]} />}>
        <Route path="/InicioOdontologo" element={<InicioOdontologo />} />
        {/* <Route path="/pacientes" element={<PacientesPage />} />
       <Route path="/odontologo/turnos" element={<TurnosPageOdonto />} /> */}
      </Route>

      {/* RUTAS PACIENTE */}
      <Route element={<PrivateRoutes roles={["PACIENTE"]} />}>
        <Route path="/inicio-paciente" element={<InicioPaciente />} />
        <Route path="/reservar-cita" element={<ReservarCitaPage />} />
        <Route path="/paciente/servicios" element={<ServiciosPacientePage />} />
        <Route path="/paciente/horario" element={<HorariosDoctoresPage />} />
        <Route path="/paciente/odontologos" element={<OdontologosPage />} />
        <Route path="/pacientes/doctores-servicios/:idEmpleado" element={<OdontologoServiciosPage />} />
        <Route path="/pagos-paciente" element={<PagosPacientePage />} />
        <Route path="/ver-pago-paciente/:idPago" element={<VerPagoPacientePage />} />
        <Route path="/ver-recibo-paciente/:idRecibo" element={<VerReciboPacientePage />} />
      </Route>
    </Routes>
  );
};
