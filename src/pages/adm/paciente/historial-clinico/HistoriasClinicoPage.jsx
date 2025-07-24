// src/pages/adm/historialclinico/HistoriasClinicoPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialesByPaciente } from '../../../../services/historial-clinico.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import { Eye } from 'lucide-react';

export const HistoriasClinicoPage = () => {
  const { idPaciente } = useParams();
  const [historias, setHistorias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!idPaciente) return;
    getHistorialesByPaciente(idPaciente)
      .then(setHistorias)
      .catch(console.error);
  }, [idPaciente]);

  const filtrados = historias.filter(h =>
    h.diagnostico.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto mt-6 bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-4 text-center">
          Historiales Clínicos del Paciente
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por diagnóstico..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="w-full p-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 text-blue-800 bg-blue-50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-blue-200 rounded-xl overflow-hidden text-blue-800">
            <thead className="bg-blue-100 text-blue-700 font-semibold text-sm">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Diagnóstico</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((h, idx) => (
                <tr key={h.idHistorialClinico} className="hover:bg-blue-50">
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{new Date(h.fechaRegistroHistorial).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{h.diagnostico}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/pacientes/${idPaciente}/historial/${h.idHistorialClinico}`)
                      }
                      title="Ver detalle"
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-blue-500 italic">
                    No se encontraron historiales con ese diagnóstico.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
