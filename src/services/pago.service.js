import { axiosConsultorio } from "../utils/configAxios";

// Obtener todos los pagos
export const getAllPagos = async () => {
  const { data } = await axiosConsultorio.get('/pago');
  return data;
};

// Obtener un pago por ID
export const getPagoById = async (id) => {
  const { data } = await axiosConsultorio.get(`/pago/${id}`);
  return data;
};

// Crear un nuevo pago
export const createPago = async (pago) => {
  const { data } = await axiosConsultorio.post('/pago', pago);
  return data;
};

// Actualizar un pago existente
export const updatePago = async (id, pago) => {
  const { data } = await axiosConsultorio.patch(`/pago/${id}`, pago);
  return data;
};

// Eliminar un pago
export const deletePago = async (id) => {
  const { data } = await axiosConsultorio.delete(`/pago/${id}`);
  return data;
};

export const getPagosByCita = (idCita) =>
  axiosConsultorio.get(`/pago/cita/${idCita}`).then(r => r.data);