import { axiosConsultorio } from "../utils/configAxios";

export const getAllEmpleados = async () => {
  const { data } = await axiosConsultorio.get('/empleados');
  return data;
};

export const getOneEmpleado = async (id) => {
  const { data } = await axiosConsultorio.get(`/empleados/${id}`);
  return data;
};
