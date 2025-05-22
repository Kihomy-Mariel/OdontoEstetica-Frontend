import { axiosConsultorio } from '../utils/configAxios';

export const getAllPersonas = async () => {
  const { data } = await axiosConsultorio.get('/persona');
  return data;
};

export const getPersonaById = async (id) => {
  const { data } = await axiosConsultorio.get(`/persona/${id}`);
  return data;
};
