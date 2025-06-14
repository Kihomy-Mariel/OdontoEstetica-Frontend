import { axiosConsultorio } from '../utils/configAxios';

// Crear un producto
export async function crearProducto(data) {
  const response = await axiosConsultorio.post('/producto', data);
  return response.data;
}

// Obtener todos los productos
export async function getAllProductos() {
  const response = await axiosConsultorio.get('/producto');
  return response.data;
}

// Obtener un producto por ID
export async function getProductoById(id) {
  const response = await axiosConsultorio.get(`/producto/${id}`);
  return response.data;
}

// Actualizar producto (PATCH)
export async function updateProducto(id, payload) {
  const response = await axiosConsultorio.patch(`/producto/${id}`, payload);
  return response.data;
}

// Eliminar producto
export async function deleteProducto(id) {
  const response = await axiosConsultorio.delete(`/producto/${id}`);
  return response.data;
}
