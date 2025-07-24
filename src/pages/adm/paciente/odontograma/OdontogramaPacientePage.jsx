import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOdontogramasByHistorial } from "../../../../services/odontograma.service";
import { AdminLayout } from "../../../../components/layouts/AdminLayout";
import { Eye } from "lucide-react";

export const OdontogramaPacientePage = () => {
  const { idPaciente, idHistorial } = useParams();
  const navigate = useNavigate();
  const [odontos, setOdontos] = useState([]);

  useEffect(() => {
    if (!idHistorial) return;
    getOdontogramasByHistorial(idHistorial)
      .then(setOdontos)
      .catch(console.error);
  }, [idHistorial]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Odontograma(s) del Historial <span className="text-blue-600">#{idHistorial}</span>
        </h2>

        {odontos.length === 0 ? (
          <div className="text-center text-blue-600 bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
            No hay odontogramas registrados para este historial.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {odontos.map((o) => (
              <div
                key={o.idOdontograma}
                className="bg-white border border-blue-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-800">
                    #{o.idOdontograma} – <span className="italic">{o.tipo}</span>
                  </h3>
                  <button
                    onClick={() =>
                      navigate(
                        `/pacientes/${idPaciente}/historial/${idHistorial}/odontograma/${o.idOdontograma}/detalle/1`
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  {o.descripcion || (
                    <span className="italic text-blue-400">Sin descripción disponible.</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
