import { axiosConsultorio } from '../utils/configAxios';

export const getAllPacientes = async () => {
  const { data } = await axiosConsultorio.get('/pacientes');
  return data;
};

export const getOnePaciente = async (id) => {
  const { data } = await axiosConsultorio.get(`/pacientes/${id}`);
  return data;
};

export const updatePaciente = async (idPaciente, updateData) => {
  const { data } = await axiosConsultorio.patch(`/pacientes/${idPaciente}`, updateData);
  return data;
};

export const deletePaciente = async (idPaciente) => {
  const { data } = await axiosConsultorio.delete(`/pacientes/${idPaciente}`);
  return data;
};

// Opcional: para registrar pacientes si tienes ese endpoint
export const registerPaciente = async (registerData) => {
  const { data } = await axiosConsultorio.post('/pacientes', registerData);
  return data;
};
