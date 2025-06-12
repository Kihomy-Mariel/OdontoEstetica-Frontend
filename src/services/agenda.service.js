import { axiosConsultorio } from "../utils/configAxios";

/* =========================================================
 *  A G E N D A S
 * ======================================================= */

/** POST /agendas */
export const createAgenda = async (payload) => {
  const { data } = await axiosConsultorio.post("/agendas", payload);
  return data;
};

/** GET /agendas */
export const getAllAgendas = async () => {
  const { data } = await axiosConsultorio.get("/agendas");
  return data;
};

/** GET /agendas/:id */
export const getAgendaById = async (id) => {
  const { data } = await axiosConsultorio.get(`/agendas/${id}`);
  return data;
};

/** PATCH /agendas/:id */
export const updateAgenda = async (id, payload) => {
  const { data } = await axiosConsultorio.patch(`/agendas/${id}`, payload);
  return data;
};

/** DELETE /agendas/:id */
export const deleteAgenda = async (id) => {
  const { data } = await axiosConsultorio.delete(`/agendas/${id}`);
  return data;
};
