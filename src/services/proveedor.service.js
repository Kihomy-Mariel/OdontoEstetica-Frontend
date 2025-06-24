import { axiosConsultorio } from '../utils/configAxios';

// Obtener todos los proveedores
export const getAllProveedores = async () => {
  const { data } = await axiosConsultorio.get('/proveedor');
  return data;
};

// Obtener un proveedor por ID
export const getOneProveedor = async (idProveedor) => {
  const { data } = await axiosConsultorio.get(`/proveedor/${idProveedor}`);
  return data;
};

// Registrar un proveedor nuevo
export const registerProveedor = async (proveedorData) => {
  const { data } = await axiosConsultorio.post('/proveedor', proveedorData);
  return data;
};

// Actualizar un proveedor existente
export const updateProveedor = async (idProveedor, updateData) => {
  const { data } = await axiosConsultorio.put(`/proveedor/${idProveedor}`, updateData);
  return data;
};

// Eliminar un proveedor (borrado lógico)
export const deleteProveedor = async (idProveedor) => {
  const { data } = await axiosConsultorio.put(`/proveedor/${idProveedor}`, { habilitado: 0 });
  return data;
};
