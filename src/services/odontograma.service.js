// src/services/odontograma.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const getOdontogramasByHistorial = (idHistorial) =>
  axiosConsultorio
    .get(`/odontograma/historial/${idHistorial}`)
    .then(r => r.data);

export const createOdontograma = dto =>
  axiosConsultorio.post('/odontograma', dto).then(r => r.data);

export const getOdontogramaById = (id) =>
  axiosConsultorio
    .get(`/odontograma/${id}`)
    .then(r => r.data);

export const updateOdontograma = (id, payload) =>
  axiosConsultorio
    .patch(`/odontograma/${id}`, payload)
    .then(r => r.data);

export const deleteOdontograma = (id) =>
  axiosConsultorio
    .delete(`/odontograma/${id}`)
    .then(r => r.data);
