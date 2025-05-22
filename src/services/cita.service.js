// src/services/cita.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const createCita = dto =>
  axiosConsultorio.post('/citas', dto).then(r => r.data);

export const getCitas = () =>
  axiosConsultorio.get('/citas').then(r => r.data);

export const getCitasByPaciente = id =>
  axiosConsultorio.get(`/citas/paciente/${id}`).then(r => r.data);

export const cancelCita = id =>
  axiosConsultorio.patch(`/citas/${id}`, { estado: 'CANCELADA' });

export const confirmCita = id =>
  axiosConsultorio.patch(`/citas/${id}`, { estado: 'CONFIRMADA' });
