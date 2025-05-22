import { axiosConsultorio } from '../utils/configAxios';

export const getAllUsuarios = async () => {
  const { data } = await axiosConsultorio.get('/usuario');
  return data;
};

export const getUsuarioById = async (id) => {
  const { data } = await axiosConsultorio.get(`/usuario/${id}`);
  return data;
};
