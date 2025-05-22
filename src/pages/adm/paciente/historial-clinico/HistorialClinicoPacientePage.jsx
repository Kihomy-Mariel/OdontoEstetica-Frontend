// src/pages/adm/historialclinico/HistorialClinicoPacientePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialClinicoById } from '../../../../services/historial-clinico.service';
import { getOdontogramasByHistorial } from '../../../../services/odontograma.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import './HistorialClinicoPacientePage.css';
import { Eye } from 'lucide-react';

export const HistorialClinicoPacientePage = () => {
  const { idPaciente, idHistorial } = useParams();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState(null);
  const [odontos, setOdontos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Cargo el historial
    getHistorialClinicoById(idHistorial)
      .then(h => {
        setHistorial(h);
        // 2) Cargo los odontogramas asociados
        return getOdontogramasByHistorial(h.idHistorialClinico);
      })
      .then(setOdontos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [idHistorial]);

  if (loading || !historial) {
    return (
      <AdminLayout>
        <p>Cargando historial clínico…</p>
      </AdminLayout>
    );
  }

  const p = historial.paciente.persona;

  return (
    <AdminLayout>
      <div className="detalle-container">
        <h2>Historial Clínico #{historial.idHistorialClinico}</h2>
        <div className="odo-action">
          {odontos.length > 0 ? (
            <button
              className="btn-view-odo"
              title="Ver odontograma"
              onClick={() =>
                navigate(
                  `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma`
                )
              }
            >
              <Eye size={16} /> Ver Odontograma
            </button>
          ) : (
            <button
              className="btn-register-odo"
              title="Registrar odontograma"
              onClick={() =>
                navigate(
                  `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma/nuevo`
                )
              }
            >
              + Registrar Odontograma
            </button>
          )}
        </div>

        <div className="paciente-info">
          <strong>Paciente:</strong> {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
        </div>
        <div className="detalle-grid">
          <div>
            <strong>Fecha:</strong>
            <p>{new Date(historial.fechaRegistroHistorial).toLocaleDateString()}</p>
          </div>
          <div>
            <strong>Edad:</strong>
            <p>{historial.edadEnConsulta}</p>
          </div>
          <div>
            <strong>Antecedentes Médicos:</strong>
            <p>{historial.antecedentesMedicos}</p>
          </div>
          <div>
            <strong>Antecedentes Odontológicos:</strong>
            <p>{historial.antecedentesOdontologicos}</p>
          </div>
          <div>
            <strong>Diagnóstico:</strong>
            <p>{historial.diagnostico}</p>
          </div>
          <div>
            <strong>Tratamiento Propuesto:</strong>
            <p>{historial.tratamientoPropuesto}</p>
          </div>
          <div>
            <strong>Tratamiento Realizado:</strong>
            <p>{historial.tratamientoRealizado}</p>
          </div>
          <div>
            <strong>Observaciones:</strong>
            <p>{historial.observaciones}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
