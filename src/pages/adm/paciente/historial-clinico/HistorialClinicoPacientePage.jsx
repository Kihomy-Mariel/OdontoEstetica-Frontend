// src/pages/adm/historialclinico/HistorialClinicoPacientePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHistorialClinicoById } from '../../../../services/historial-clinico.service';
import { getOdontogramasByHistorial } from '../../../../services/odontograma.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import { Eye } from 'lucide-react';

export const HistorialClinicoPacientePage = () => {
  const { idPaciente, idHistorial } = useParams();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState(null);
  const [odontos, setOdontos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistorialClinicoById(idHistorial)
      .then(h => {
        setHistorial(h);
        return getOdontogramasByHistorial(h.idHistorialClinico);
      })
      .then(setOdontos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [idHistorial]);

  if (loading || !historial) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[50vh] text-blue-700 font-semibold">
          Cargando historial clínico…
        </div>
      </AdminLayout>
    );
  }

  const p = historial.paciente.persona;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-blue-800">
            Historial Clínico #{historial.idHistorialClinico}
          </h2>

          {odontos.length > 0 ? (
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
              onClick={() =>
                navigate(
                  `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma`
                )
              }
              title="Ver odontograma"
            >
              <Eye size={18} /> Ver Odontograma
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-400 font-medium rounded-lg transition-all"
              onClick={() =>
                navigate(
                  `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma/nuevo`
                )
              }
              title="Registrar odontograma"
            >
              + Registrar Odontograma
            </button>
          )}
        </div>

        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700 font-medium">
            <span className="font-semibold">Paciente:</span> {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
          <div>
            <h3 className="font-semibold text-sm text-blue-600">Fecha</h3>
            <p>{new Date(historial.fechaRegistroHistorial).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-blue-600">Edad</h3>
            <p>{historial.edadEnConsulta}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Antecedentes Médicos</h3>
            <p>{historial.antecedentesMedicos}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Antecedentes Odontológicos</h3>
            <p>{historial.antecedentesOdontologicos}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Diagnóstico</h3>
            <p>{historial.diagnostico}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Tratamiento Propuesto</h3>
            <p>{historial.tratamientoPropuesto}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Tratamiento Realizado</h3>
            <p>{historial.tratamientoRealizado}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-blue-600">Observaciones</h3>
            <p>{historial.observaciones}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
