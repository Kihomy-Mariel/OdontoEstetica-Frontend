import { axiosConsultorio } from "../utils/configAxios";

/** GET: todos los turnos habilitados */
export const getAllTurnos = async () => {
  const { data } = await axiosConsultorio.get("/turno");
  return data;
};

/** GET: un turno por ID */
export const getOneTurno = async (idTurno) => {
  const { data } = await axiosConsultorio.get(`/turno/${idTurno}`);
  return data;
};


/** POST: crear un nuevo turno */
export const createTurno = async (payload) => {
  const { data } = await axiosConsultorio.post("/turno", payload);
  return data;
};

/** PATCH: actualizar un turno existente */
export const updateTurno = async (idTurno, payload) => {
  const { data } = await axiosConsultorio.patch(`/turno/${idTurno}`, payload);
  return data;
};

export const deleteTurno = async (idTurno) => {
  const { data } = await axiosConsultorio.delete(`/turno/${idTurno}`);
  return data;
};

