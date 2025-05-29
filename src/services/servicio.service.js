import { axiosConsultorio } from '../utils/configAxios';

// Crear un nuevo servicio
export async function crearServicio(data) {
  const response = await axiosConsultorio.post("/servicio", data);
  return response.data;
}

// Obtener todos los servicios
export async function getAllServicios() {
  const response = await axiosConsultorio.get("/servicio");
  return response.data;
}

// Obtener un servicio por su ID
export const getServicioById = async (id) => {
  const { data } = await axiosConsultorio.get(`/servicio/${id}`);
  return data;
};

export const updateServicio = async (id, payload) => {
  // PATCH porque tu backend lo espera así
  await axiosConsultorio.patch(`/servicio/${id}`, payload);
};


// Eliminar un servicio
export async function deleteServicio(id) {
  const response = await axiosConsultorio.delete(`/servicio/${id}`);
  return response.data;
}
