import { axiosConsultorio } from '../utils/configAxios';

export const getAllUsuarios = async () => {
  const { data } = await axiosConsultorio.get('/usuarios');
  return data;
};

export const getUsuarioById = async (id) => {
  const { data } = await axiosConsultorio.get(`/usuarios/${id}`);
  return data;
};
