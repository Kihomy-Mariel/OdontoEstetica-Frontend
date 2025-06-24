// src/services/cita.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const createCita = dto =>
  axiosConsultorio.post('/citas', dto).then(r => r.data);

export const getCitas = () =>
  axiosConsultorio.get('/citas').then(r => r.data);

export const getCitasByPaciente = id =>
  axiosConsultorio.get(`/citas/paciente/${id}`).then(r => r.data);

export const getCitasByFecha = (fecha) => {
  // Asegurarse que la fecha esté en formato YYYY-MM-DD
  const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
  return axiosConsultorio.get(`/citas/fecha/${fechaFormateada}`).then(r => r.data);
};

export const cancelCita = id =>
  axiosConsultorio.patch(`/citas/${id}`, { estado: 'CANCELADA' });

export const confirmCita = id =>
  axiosConsultorio.patch(`/citas/${id}`, { estado: 'CONFIRMADA' });


export const updateCita = (id, dto) =>
  axiosConsultorio.patch(`/citas/${id}`, dto).then(r => r.data);

export const softDeleteCita = (id) =>
  axiosConsultorio.patch(`/citas/${id}/soft-delete`).then(r => r.data);
