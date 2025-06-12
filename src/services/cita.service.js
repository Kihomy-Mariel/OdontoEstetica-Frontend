import { axiosConsultorio } from "../utils/configAxios";

/* =========================================================
 *  C I T A S
 * ======================================================= */

/**
 * Crea una nueva cita
 * POST /citas
 */
export const createCita = async (payload) => {
  const { data } = await axiosConsultorio.post("/citas", payload);
  return data;
};

/**
 * Obtiene todas las citas
 * GET /citas
 */
export const getAllCitas = async () => {
  const { data } = await axiosConsultorio.get("/citas");
  return data;
};

/**
 * Obtiene una cita por su ID
 * GET /citas/:id
 */
export const getCitaById = async (id) => {
  const { data } = await axiosConsultorio.get(`/citas/${id}`);
  return data;
};

/**
 * Actualiza una cita
 * PATCH /citas/:id
 */
export const updateCita = async (id, payload) => {
  const { data } = await axiosConsultorio.patch(`/citas/${id}`, payload);
  return data;
};

/**
 * Elimina una cita
 * DELETE /citas/:id
 */
export const deleteCita = async (id) => {
  const { data } = await axiosConsultorio.delete(`/citas/${id}`);
  return data;
};

/* --- extras útiles --- */

/**  GET /citas/paciente/:idPaciente  */
export const getCitasByPaciente = async (idPaciente) => {
  const { data } = await axiosConsultorio.get(`/citas/paciente/${idPaciente}`);
  return data;
};

/**  GET /citas/agenda/:idAgenda  */
export const getCitasByAgenda = async (idAgenda) => {
  const { data } = await axiosConsultorio.get(`/citas/agenda/${idAgenda}`);
  return data;
};
