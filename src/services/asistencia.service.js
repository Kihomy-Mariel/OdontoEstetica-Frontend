// src/services/asistencia.service.js
import { axiosConsultorio } from "../utils/configAxios";

/** POST: Asignar un turno a un empleado */
export const asignarAsistencia = async (payload) => {
  const { data } = await axiosConsultorio.post("/asistencias", payload);
  return data;
};

/** DELETE: Eliminar asignación de turno */
export const eliminarAsistencia = async (idEmpleado, idTurno, dia) => {
  const { data } = await axiosConsultorio.delete(`/asistencias/${idEmpleado}/${idTurno}/${dia}`);
  return data;
};

export const getAllAsistencias = async () => {
  const { data } = await axiosConsultorio.get("/asistencias");
  return data;
};

/** GET: Obtener agenda por empleado */
export const getAgendaEmpleado = async (idEmpleado) => {
  const { data } = await axiosConsultorio.get(`/asistencias/empleado/${idEmpleado}`);
  return data;
};

/** PATCH: Actualizar asignación existente */
export const actualizarAsistencia = async (idEmpleado, idTurno, diaSemana, payload) => {
  const { data } = await axiosConsultorio.patch(`/asistencias/${idEmpleado}/${idTurno}/${diaSemana}`, payload);
  return data;
};
