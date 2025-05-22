// src/services/archivo-clinico.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const getArchivosByHistorial = (idHistorial) =>
  axiosConsultorio.get(`/archivo-clinico/historial/${idHistorial}`).then(r => r.data);
