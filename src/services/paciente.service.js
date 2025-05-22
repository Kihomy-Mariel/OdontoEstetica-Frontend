import { axiosConsultorio } from '../utils/configAxios';

export const getAllPacientes = async () => {
  const { data } = await axiosConsultorio.get('/pacientes');
  return data;
};

export const getOnePaciente = async (id) => {
  const { data } = await axiosConsultorio.get(`/pacientes/${id}`);
  return data;
};
