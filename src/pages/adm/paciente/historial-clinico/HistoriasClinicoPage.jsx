// src/pages/adm/historialclinico/HistoriasClinicoPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialesByPaciente } from '../../../../services/historial-clinico.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import { Eye } from 'lucide-react';
import './HistoriasClinicoPage.css';

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

  const filtrados = historias.filter(h => {
    const texto = `${h.diagnostico}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="historias-container">
        <h2 className="page-title">Historiales de {historias[0]?.paciente.persona.nombres || ''}</h2>
        <input
          type="text"
          placeholder="Buscar por diagnóstico..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="filtro-input"
        />
        <div className="tabla-scroll">
          <table className="historias-table">
            <thead>
              <tr>
                <th>Nro.</th>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((h, idx) => (
                <tr key={h.idHistorialClinico}>
                  <td>{idx + 1}</td>
                  <td>{new Date(h.fechaRegistroHistorial).toLocaleDateString()}</td>
                  <td>{h.diagnostico}</td>
                  <td>
                    <button
                      className="btn-view"
                      title="Ver detalle"
                      onClick={() =>
                        navigate(
                          `/pacientes/${idPaciente}/historial/${h.idHistorialClinico}`
                        )
                      }
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};