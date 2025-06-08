// src/services/recibo.service.js
import { axiosConsultorio } from "../utils/configAxios";

/* ───────────── CONSULTAS ───────────── */

/** Obtener todos los recibos */
export const getAllRecibos = async () => {
  const { data } = await axiosConsultorio.get("/recibos");
  return data;
};

/** Obtener un recibo por ID */
export const getOneRecibo = async (id) => {
  const { data } = await axiosConsultorio.get(`/recibos/${id}`);
  return data;
};

/* ───────────── MUTACIONES ───────────── */

/** Crear un recibo
 *  @param {Object} reciboDto => { idPago, fechaEmision, monto, saldoPendiente, observaciones, estado }
 */
export const createRecibo = async (reciboDto) => {
  const { data } = await axiosConsultorio.post("/recibos", reciboDto);
  return data;
};

/** Actualizar un recibo parcial (PATCH) */
export const updateRecibo = async (id, changes) => {
  const { data } = await axiosConsultorio.patch(`/recibos/${id}`, changes);
  return data;
};

/** Eliminar un recibo */
export const deleteRecibo = async (id) => {
  const { data } = await axiosConsultorio.delete(`/recibos/${id}`);
  return data;
};