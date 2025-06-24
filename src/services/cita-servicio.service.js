// src/services/cita-servicio.service.js
import { axiosConsultorio } from '../utils/configAxios';

// Crear una nueva relación cita-servicio
export const createCitaServicio = (dto) =>
  axiosConsultorio.post('/cita-servicio', dto).then(r => r.data);

// Obtener todas las relaciones cita-servicio
export const getAllCitaServicios = () =>
  axiosConsultorio.get('/cita-servicio').then(r => r.data);

// Obtener una cita-servicio específica (por idCita y idServicio)
export const getCitaServicio = (idCita, idServicio) =>
  axiosConsultorio.get(`/cita-servicio/${idCita}/${idServicio}`).then(r => r.data);

// Actualizar una cita-servicio (por idCita y idServicio)
export const updateCitaServicio = (idCita, idServicio, dto) =>
  axiosConsultorio.patch(`/cita-servicio/${idCita}/${idServicio}`, dto).then(r => r.data);

// Eliminar una cita-servicio (por idCita y idServicio)
export const deleteCitaServicio = (idCita, idServicio) =>
  axiosConsultorio.delete(`/cita-servicio/${idCita}/${idServicio}`).then(r => r.data);

// Obtener todas las cita-servicio de una cita en particular
export const getCitaServiciosByCita = (idCita) =>
  axiosConsultorio.get(`/cita-servicio/cita/${idCita}`).then(r => r.data);

