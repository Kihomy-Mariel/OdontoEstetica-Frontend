import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import {
  getAllCitas,
  deleteCita
} from "../../../services/cita.service";	

  import {
  getAllCitaServicios
} from "../../../services/cita-servicio.service";

import "./CitaPageAdm.css";

export const CitaPageAdm = () => {
  const [citas, setCitas] = useState([]);
  const [citaServicios, setCitaServicios] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const citasData = await getAllCitas();
      const citaServiciosData = await getAllCitaServicios();
      setCitas(citasData);
      setCitaServicios(citaServiciosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  // Encontrar servicios asociados a una cita
  const serviciosPorCita = (idCita) =>
    citaServicios.filter((cs) => cs.idCita === idCita);

  const handleEliminarCita = async (idCita) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      await deleteCita(idCita);
      // Actualizar listas localmente
      setCitas(citas.filter((c) => c.idCita !== idCita));
      setCitaServicios(citaServicios.filter((cs) => cs.idCita !== idCita));
    } catch (error) {
      console.error("Error eliminando cita:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="cita-page-adm-container">
        <h2>Citas administrativas</h2>
        <table className="tabla-citas">
          <thead>
            <tr>
              <th>Nro. Cita</th>
              <th>Servicio</th>
              <th>Precio Aplicado</th>
              <th>Cantidad</th>
              <th>Observaciones</th>
              <th>Paciente</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 && (
              <tr>
                <td colSpan="11">No hay citas registradas</td>
              </tr>
            )}
            {citas.map((cita) => {
              const servicios = serviciosPorCita(cita.idCita);
              return servicios.length > 0 ? (
                servicios.map((servicio, idx) => (
                  <tr key={`${cita.idCita}-${servicio.idServicio}`}>
                    {idx === 0 && (
                      <>
                        <td rowSpan={servicios.length}>{cita.idCita}</td>
                        <td>{servicio.servicio?.nombre || "Servicio"}</td>
                        <td>{servicio.precioAplicado}</td>
                        <td>{servicio.cantidadServicio}</td>
                        <td>{servicio.observaciones}</td>
                        <td rowSpan={servicios.length}>
                          {cita.paciente
                            ? `${cita.paciente.persona.nombres} ${cita.paciente.persona.apellidoPaterno}`
                            : "Paciente"}
                        </td>
                        <td rowSpan={servicios.length}>{cita.estado}</td>
                        <td rowSpan={servicios.length}>{cita.motivo}</td>
                        <td rowSpan={servicios.length}>{cita.fecha}</td>
                        <td rowSpan={servicios.length}>{cita.hora}</td>
                        <td rowSpan={servicios.length}>
                          <button
                            className="btn-editar"
                            onClick={() =>
                              alert(`Editar cita ${cita.idCita} (a implementar)`)
                            }
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-eliminar"
                            onClick={() => handleEliminarCita(cita.idCita)}
                          >
                            🗑️
                          </button>
                        </td>
                      </>
                    )}
                    {idx !== 0 && (
                      <>
                        <td>{servicio.servicio?.nombre || "Servicio"}</td>
                        <td>{servicio.precioAplicado}</td>
                        <td>{servicio.cantidadServicio}</td>
                        <td>{servicio.observaciones}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr key={cita.idCita}>
                  <td>{cita.idCita}</td>
                  <td colSpan="4">No hay servicios asignados</td>
                  <td>
                    {cita.paciente
                      ? `${cita.paciente.persona.nombres} ${cita.paciente.persona.apellidoPaterno}`
                      : "Paciente"}
                  </td>
                  <td>{cita.estado}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() =>
                        alert(`Editar cita ${cita.idCita} (a implementar)`)
                      }
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminarCita(cita.idCita)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
