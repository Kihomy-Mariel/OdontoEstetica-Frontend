// src/services/odontograma-detalle.service.js
import { axiosConsultorio } from '../utils/configAxios';

// Obtiene todos los detalles (los dientes) de un odontograma
export const getDetallesByOdontograma = async (idOdontograma) => {
  const { data } = await axiosConsultorio.get(
    `/odontograma-detalle/odontograma/${idOdontograma}`
  );
  return data;
};

// Crea un nuevo detalle
export const createDetalle = async (detalle) => {
  const { data } = await axiosConsultorio.post(
    '/odontograma-detalle',
    detalle
  );
  return data;
};

// Actualiza un detalle existente
export const updateDetalle = async (idDetalle, cambios) => {
  const { data } = await axiosConsultorio.patch(
    `/odontograma-detalle/${idDetalle}`,
    cambios
  );
  return data;
};

// Elimina un detalle
export const deleteDetalle = async (idDetalle) => {
  await axiosConsultorio.delete(`/odontograma-detalle/${idDetalle}`);
};

// src/services/odontograma-detalle.service.js
export const getOneDetalle = async (idDetalle) => {
  const { data } = await axiosConsultorio.get(`/odontograma-detalle/${idDetalle}`);
  return data;
};

