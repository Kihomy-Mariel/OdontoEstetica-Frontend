// src/pages/adm/odontograma/OdontogramaPacientePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOdontogramasByHistorial } from "../../../../services/odontograma.service";
import { AdminLayout } from "../../../../components/layouts/AdminLayout";
import { Eye } from "lucide-react";
import "./OdontogramaPacientePage.css";

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
      <div className="odonto-container">
        <h2 className="page-title">
          Odontograma(s) del Historial <span>#{idHistorial}</span>
        </h2>

        {odontos.length === 0 && (
          <div className="empty-msg">
            No hay odontogramas registrados para este historial.
          </div>
        )}

        <div className="odonto-grid">
          {odontos.map(o => (
            <div key={o.idOdontograma} className="odonto-card">
              <div className="odonto-header">
                <div className="odonto-title">
                  #{o.idOdontograma} – <em>{o.tipo}</em>
                </div>
                <button
                  className="btn-view"
                  onClick={() =>
                    navigate(
                      `/pacientes/${idPaciente}/historial/${idHistorial}` +
                      `/odontograma/${o.idOdontograma}/detalle/1`
                    )
                  }
                  aria-label="Ver detalle del odontograma"
                >
                  <Eye size={18} /> Ver
                </button>
              </div>
              <div className="odonto-desc">
                {o.descripcion || (
                  <span className="empty-msg">
                    Sin descripción disponible.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
