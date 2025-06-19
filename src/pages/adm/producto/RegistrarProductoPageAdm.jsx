import React, { useState } from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { crearProducto } from "../../../services/producto.service";
import { useNavigate } from "react-router-dom";

export const RegistrarProductoPageAdm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreProducto: "",
    descripcion: "",
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: "",
    habilitado: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando datos:", form);
      await crearProducto(form);
      alert("Producto registrado exitosamente.");
      navigate("/productos");
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert(error?.response?.data?.message || "Hubo un error al registrar producto.");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 py-6 sm:px-8 md:px-16 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Registrar Producto</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                name="nombreProducto"
                value={form.nombreProducto}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
                <input
                  type="number"
                  name="stockActual"
                  value={form.stockActual}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={form.stockMinimo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
              <input
                type="text"
                name="unidadMedida"
                value={form.unidadMedida}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="habilitado"
                checked={form.habilitado}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Producto habilitado</label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/productos")}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
