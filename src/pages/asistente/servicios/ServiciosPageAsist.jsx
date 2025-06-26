import React, { useEffect, useState } from "react";
import { getAllServicios, deleteServicio } from "../../../services/servicio.service";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export const ServiciosPageAsist = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchServicios = async () => {
    setLoading(true);
    const data = await getAllServicios();
    setServicios(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
    try {
      await deleteServicio(id);
      fetchServicios();
    } catch (err) {
      alert("Error al eliminar el servicio.");
    }
  };

  const serviciosFiltrados = servicios
    .filter((s) => s.habilitado)
    .filter((s) => s.nombreServicio.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <AsistLayout>
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-1">Gestión de Servicios</h2>
          <p className="text-gray-500 text-base">Administre los servicios ofrecidos por el consultorio</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-64"
          />
          <button
            onClick={() => navigate("/servicios/nuevo")}
            className="bg-blue-700 hover:bg-blue-900 text-white font-medium px-5 py-2 rounded-md transition duration-150"
          >
            + Nuevo Servicio
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Nro.</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Nombre</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Descripción</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Duración</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Precio (BS.)</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No hay servicios registrados.
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map((s, i) => (
                  <tr key={s.idServicio} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 text-sm">{i + 1}</td>
                    <td className="px-4 py-3 text-sm">{s.nombreServicio}</td>
                    <td className="px-4 py-3 text-sm">{s.descripcion}</td>
                    <td className="px-4 py-3 text-sm">{s.duracionEstimada}</td>
                    <td className="px-4 py-3 text-sm">BS.{Number(s.precio).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        title="Editar"
                        onClick={() => navigate(`/asistente/servicios/${s.idServicio}/editar`)}
                        className="text-blue-600 hover:bg-blue-100 rounded-md p-1 mr-2"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => handleDelete(s.idServicio)}
                        className="text-red-600 hover:bg-red-100 rounded-md p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AsistLayout>
  );
};
