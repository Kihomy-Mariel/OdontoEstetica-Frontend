import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getServicioById, updateServicio } from "../../../services/servicio.service";

export const EditarServicioPageAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServicioById(id)
      .then(data => {
        setServicio(data);
        setLoading(false);
      })
      .catch(err => {
        setError("No se pudo cargar el servicio");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServicio((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      nombreServicio: servicio.nombreServicio,
      descripcion: servicio.descripcion,
      precio: Number(servicio.precio),
      duracionEstimada: servicio.duracionEstimada,
    };

    try {
      await updateServicio(id, payload);
      navigate("/servicios");
    } catch (err) {
      setError("Error al guardar cambios.");
      console.error("ERROR BACKEND:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-blue-700 font-medium">Cargando...</div>
      </AdminLayout>
    );
  }

  if (!servicio) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-red-600 font-semibold">
          No se encontró el servicio
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          Editar Servicio
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Realice los cambios necesarios y guarde para actualizar el servicio
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-center p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-600 font-medium mb-1">
              Nombre del servicio
            </label>
            <input
              name="nombreServicio"
              value={servicio.nombreServicio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: Limpieza dental"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">
              Descripción
            </label>
            <input
              name="descripcion"
              value={servicio.descripcion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: Eliminación de placa"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">
              Duración estimada
            </label>
            <input
              name="duracionEstimada"
              value={servicio.duracionEstimada}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: 45 minutos"
            />
          </div>

          <div>
            <label className="block text-blue-600 font-medium mb-1">Precio (BS.)</label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              value={servicio.precio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: 50.00"
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
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
