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

// Nuevos servicios específicos para doctores
export const getAllDoctores = async () => {
  const { data } = await axiosConsultorio.get('/empleados/doctores');
  return data;
};

export const getDoctoresPorEspecialidad = async (especialidadId) => {
  const { data } = await axiosConsultorio.get(`/empleados/doctores`, {
    params: { especialidadId }
  });
  return data;
};

export const getEspecialidades = async () => {
  const { data } = await axiosConsultorio.get('/empleados/especialidades');
  return data;
};