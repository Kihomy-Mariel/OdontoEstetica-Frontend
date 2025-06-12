// src/services/archivo-clinico.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const getArchivosByHistorial = (idHistorial) =>
  axiosConsultorio.get(`/archivo-clinico/historial/${idHistorial}`).then(r => r.data);

export const subirArchivoClinico = (formData) =>
  axiosConsultorio.post('/archivo-clinico/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);
