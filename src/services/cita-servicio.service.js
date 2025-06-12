import { axiosConsultorio } from "../utils/configAxios";

/* =========================================================
 *  C I T A   –  S E R V I C I O
 * ======================================================= */

/**
 * Añade un servicio a una cita
 * POST /cita-servicios
 */
export const createCitaServicio = async (payload) => {
  const { data } = await axiosConsultorio.post("/cita-servicios", payload);
  return data;
};

/** GET /cita-servicios  */
export const getAllCitaServicios = async () => {
  const { data } = await axiosConsultorio.get("/cita-servicios");
  return data;
};

/** GET /cita-servicios/:idCita/:idServicio  */
export const getCitaServicio = async (idCita, idServicio) => {
  const { data } = await axiosConsultorio.get(
    `/cita-servicios/${idCita}/${idServicio}`
  );
  return data;
};

/** PATCH /cita-servicios/:idCita/:idServicio  */
export const updateCitaServicio = async (idCita, idServicio, payload) => {
  const { data } = await axiosConsultorio.patch(
    `/cita-servicios/${idCita}/${idServicio}`,
    payload
  );
  return data;
};

/** DELETE /cita-servicios/:idCita/:idServicio  */
export const deleteCitaServicio = async (idCita, idServicio) => {
  const { data } = await axiosConsultorio.delete(
    `/cita-servicios/${idCita}/${idServicio}`
  );
  return data;
};

/**  GET /cita-servicios/cita/:idCita  → todos los servicios de una cita */
export const getServiciosByCita = async (idCita) => {
  const { data } = await axiosConsultorio.get(
    `/cita-servicios/cita/${idCita}`
  );
  return data;
};
