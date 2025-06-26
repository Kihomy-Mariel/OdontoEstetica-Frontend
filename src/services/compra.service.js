import { axiosConsultorio } from '../utils/configAxios';

// Obtener todos los empleados
export const getEmpleadoById = async (id) => {
  const { data } = await axiosConsultorio.get(`/empleados/${id}`);
  return data;
};

export const getProveedorById = async (id) => {
  const { data } = await axiosConsultorio.get(`/proveedores/${id}`);
  return data;
};

// Obtener todos los productos
export const getProductoById = async (id) => {
  const { data } = await axiosConsultorio.get(`/productos/${id}`);
  return data;
};
// Obtener todas las compras
export const getAllCompras = async () => {
  const { data } = await axiosConsultorio.get('/compras');
  return data;
};

// Obtener una compra por ID
export const getOneCompra = async (idCompra) => {
  const { data } = await axiosConsultorio.get(`/compras/${idCompra}`);
  return data;
};

// Registrar una nueva compra
export const registerCompra = async (compraData) => {
  const { data } = await axiosConsultorio.post('/compras', compraData);
  return data;
};

// Obtener todos los empleados
export const getEmpleados = async () => {
  const { data } = await axiosConsultorio.get('/empleados');
  return data;
};

// Obtener todos los proveedores
export const getProveedores = async () => {
  const { data } = await axiosConsultorio.get('/proveedores');
  return data;
};
