// src/services/realiza.service.js
import { axiosConsultorio } from '../utils/configAxios';

/* ─────────────────────────  CREAR / INSERTAR  ───────────────────────── */

// Crea una relación empleado‑servicio
export const createRealiza = async (payload) => {
  // payload: { idEmpleado, idServicio, observaciones, habilitado? }
  const { data } = await axiosConsultorio.post('/realiza', payload);
  return data;
};

/* ───────────────────────────  LECTURAS (GET)  ───────────────────────── */

// Todos los registros realiza
export const getAllRealiza = async () => {
  const { data } = await axiosConsultorio.get('/realiza');
  return data;
};

// Servicios que realiza un odontólogo concreto
export const getServiciosByEmpleado = async (idEmpleado) => {
  const { data } = await axiosConsultorio.get(
    `/realiza/empleado/${idEmpleado}/servicios`
  );
  return data;
};

// Odontólogos que brindan un servicio concreto
export const getEmpleadosByServicio = async (idServicio) => {
  const { data } = await axiosConsultorio.get(
    `/realiza/servicio/${idServicio}/empleados`
  );
  return data;
};

// Relación puntual (clave compuesta)
export const getOneRealiza = async (idEmpleado, idServicio) => {
  const { data } = await axiosConsultorio.get(
    `/realiza/${idEmpleado}/${idServicio}`
  );
  return data;
};

// Resumen: cada servicio con sus odontólogos habilitados
export const getServiciosConOdontologos = async () => {
  const { data } = await axiosConsultorio.get(
    '/realiza/servicios-con-odontologos'
  );
  return data;
};


/* ───────────────────────  ACTUALIZAR / PATCH  ──────────────────────── */
export const updateRealiza = async ({ idEmpleado, idServicio, observaciones }) => {
  const { data } = await axiosConsultorio.patch(
    `/realiza/${idEmpleado}/${idServicio}`,
    { observaciones }
  );
  return data;
};

/* ───────────────────────────  ELIMINAR  ───────────────────────────── */
export const deleteRealiza = async ({ idEmpleado, idServicio }) => {
  const { data } = await axiosConsultorio.delete(
    `/realiza/${idEmpleado}/${idServicio}`
  );
  return data;
};
