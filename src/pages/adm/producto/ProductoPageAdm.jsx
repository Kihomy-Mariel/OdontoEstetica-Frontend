import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProductos, deleteProducto, updateProducto } from "../../../services/producto.service";
import { Plus, Search, Trash2, Edit, Power } from "lucide-react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const columnas = [
  "#",
  "Nombre Producto",
  "Descripción",
  "Stock Actual",
  "Stock Mínimo",
  "Unidad Medida",
  "Acciones",
];

export const ProductoPageAdm = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await getAllProductos();
      setProductos(data);
    } catch (err) {
      toast.error("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarProductos = () => {
    return productos.filter(
      (p) =>
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
  };





  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro de eliminar este producto?")) {
      try {
        await deleteProducto(id);
        toast.success("Producto eliminado correctamente");
        cargarProductos();
      } catch (error) {
        toast.error("No se pudo eliminar el producto");
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 py-4 sm:px-8 md:px-16 bg-gray-50 min-h-screen">{/* Header & estadísticas */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Inventario</h1>
          {/* Aquí podrías agregar cards de estadísticas si deseas */}
        </div>
        {/* Barra de búsqueda y botón */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center border rounded-lg bg-white px-3 py-2 shadow-sm w-full sm:max-w-md">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="outline-none w-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/productos/nuevo")}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition"
          >
            <Plus className="mr-2" /> Agregar Producto
          </button>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr>
                  {columnas.map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 font-semibold text-left bg-gray-100"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrarProductos().length === 0 ? (
                  <tr>
                    <td colSpan={columnas.length} className="px-4 py-6 text-center text-gray-400">
                      {busqueda ? "No se encontraron resultados" : "No hay productos registrados."}
                    </td>
                  </tr>
                ) : (
                  filtrarProductos().map((prod, idx) => (
                    <tr
                      key={prod.idProducto}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{prod.nombreProducto}</td>
                      <td className="px-4 py-3">{prod.descripcion}</td>
                      <td className="px-4 py-3">{prod.stockActual}</td>
                      <td className="px-4 py-3">{prod.stockMinimo}</td>
                      <td className="px-4 py-3">{prod.unidadMedida}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                          title="Editar"
                          onClick={() => navigate(`/productos/editar/${prod.idProducto}`)}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                          title="Eliminar"
                          onClick={() => handleEliminar(prod.idProducto)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
