import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { crearServicio } from "../../../services/servicio.service";

export const RegistrarServicioAdm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreServicio: "",
    descripcion: "",
    duracionEstimada: "",
    precio: "",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
      };
      await crearServicio(payload);
      navigate("/servicios");
    } catch (err) {
      setError("Error al registrar el servicio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Registrar Nuevo Servicio</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Complete los campos para agregar un nuevo servicio al consultorio
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-center p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-600 font-medium mb-1">Nombre del servicio</label>
            <input
              name="nombreServicio"
              value={form.nombreServicio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: Limpieza dental"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">Descripción</label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: Eliminación de placa bacteriana"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">Duración estimada</label>
            <input
              name="duracionEstimada"
              value={form.duracionEstimada}
              onChange={handleChange}
              required
              placeholder="Ej: 30 minutos"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">Precio (BS.)</label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              value={form.precio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: 25.00"
            />
          </div>




          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/servicios")}
              className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
