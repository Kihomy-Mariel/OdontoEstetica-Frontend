import React, { useEffect, useState } from "react";
import { getAllServicios } from "../../../services/servicio.service";
import { PacienteLayout } from "../../../components/layouts/PacienteLayout";

export const ServiciosPacientePage = () => {
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

  const serviciosFiltrados = servicios
    .filter((s) => s.habilitado)
    .filter((s) => s.nombreServicio.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <PacienteLayout>
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-1">Servicios Disponibles</h2>
          <p className="text-gray-500 text-base">Consulta los servicios ofrecidos por el consultorio</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-64"
          />
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PacienteLayout>
  );
};