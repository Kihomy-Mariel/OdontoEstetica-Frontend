import { axiosConsultorio } from "../utils/configAxios";

export const getAllEmpleados = async () => {
  const { data } = await axiosConsultorio.get('/empleados');
  return data;
};

export const getOneEmpleado = async (id) => {
  const { data } = await axiosConsultorio.get(`/empleados/${id}`);
  return data;
};

export const updateEmpleado = async (idEmpleado, updateData) => {
  return axiosConsultorio.patch(`/empleados/${idEmpleado}`, updateData);
};


export const deleteEmpleado = async (idEmpleado) => {
  const { data } = await axiosConsultorio.delete(`/empleados/${idEmpleado}`);
  return data;
};

// Opcional, para registrar empleado
export const registerEmpleado = async (registerData) => {
  const { data } = await axiosConsultorio.post(`/empleados/register-empleado`, registerData);
  return data;
};
