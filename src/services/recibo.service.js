import { axiosConsultorio } from "../utils/configAxios";

/* ───────────── CONSULTAS ───────────── */

export const getAllRecibos = async () => {
  const { data } = await axiosConsultorio.get("/recibo");
  return data;
};

export const getOneRecibo = async (id) => {
  const { data } = await axiosConsultorio.get(`/recibo/${id}`);
  return data;
};

/** 🔍  Obtener los recibos de un pago */
export const getReciboByPago = async (idPago) => {
  const { data } = await axiosConsultorio.get(`/recibo/pago/${idPago}`);
  return data; // objeto recibo o null
};

/* ───────────── MUTACIONES ───────────── */

export const createRecibo = async (reciboDto) => {
  try {
    const { data } = await axiosConsultorio.post("/recibo", reciboDto);
    return data;
  } catch (error) {
    console.error("Error al crear el recibo:", error?.response?.data || error);
    throw error;
  }
};


export const updateRecibo = async (id, changes) => {
  const { data } = await axiosConsultorio.patch(`/recibo/${id}`, changes);
  return data;
};

export const deleteRecibo = async (id) => {
  const { data } = await axiosConsultorio.delete(`/recibo/${id}`);
  return data;
};


export const checkReciboExiste = async (idPago) => {
  const recibo = await getReciboByPago(idPago);
  return recibo !== null;
};
