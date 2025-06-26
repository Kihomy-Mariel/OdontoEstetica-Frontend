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


// Nuevos servicios para horarios
export const getCitasPorFecha = (fecha, idDoctor = null) => {
  const params = {
    fecha: fecha.toISOString().split('T')[0]
  };
  
  if (idDoctor) {
    params.doctorId = idDoctor;
  }

  return axiosConsultorio.get('/citas/por-fecha', { params }).then(r => r.data);
};

export const getHorariosDisponibles = (fecha, idDoctor) => {
  return axiosConsultorio.get('/citas/horarios-disponibles', {
    params: {
      fecha: fecha.toISOString().split('T')[0],
      doctorId: idDoctor
    }
  }).then(r => r.data);
};