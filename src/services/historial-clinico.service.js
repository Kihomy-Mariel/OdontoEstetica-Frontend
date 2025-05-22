// src/services/historialclinico.service.js
import { axiosConsultorio } from "../utils/configAxios";

/**
 * Crea un nuevo registro de historial clínico.
 * POST /historial-clinico
 */
export const createHistorialClinico = async (payload) => {
  const { data } = await axiosConsultorio.post("/historial-clinico", payload);
  return data;
};

/**
 * Obtiene todos los historiales clínicos.
 * GET /historial-clinico
 */
export const getAllHistorialClinico = async () => {
  const { data } = await axiosConsultorio.get("/historial-clinico");
  return data;
};

/**
 * Obtiene un historial por su ID.
 * GET /historial-clinico/:id
 */
export const getHistorialClinicoById = async (id) => {
  const { data } = await axiosConsultorio.get(`/historial-clinico/${id}`);
  return data;
};

/**
 * Actualiza un historial existente.
 * PATCH /historial-clinico/:id
 */
export const updateHistorialClinico = async (id, payload) => {
  const { data } = await axiosConsultorio.patch(`/historial-clinico/${id}`, payload);
  return data;
};

/**
 * Elimina (borra) un historial.
 * DELETE /historial-clinico/:id
 */
export const deleteHistorialClinico = async (id) => {
  const { data } = await axiosConsultorio.delete(`/historial-clinico/${id}`);
  return data;
};


// Obtener todos los historiales de un paciente
export const getHistorialesByPaciente = async (idPaciente) => {
  const { data } = await axiosConsultorio.get(
    `/historial-clinico/paciente/${idPaciente}`
  );
  return data;
};

// Obtener un historial concreto de un paciente
export const getHistorialByPacienteAndId = async (
  idPaciente,
  idHistorial
) => {
  const { data } = await axiosConsultorio.get(
    `/historial-clinico/paciente/${idPaciente}/${idHistorial}`
  );
  return data;
};