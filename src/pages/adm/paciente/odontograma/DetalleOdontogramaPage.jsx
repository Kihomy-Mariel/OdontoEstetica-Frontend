// src/pages/adm/odontograma/DetalleOdontogramaPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetallesByOdontograma } from '../../../../services/odontograma-detalle.service';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import './DetalleOdontogramaPage.css';

export const DetalleOdontogramaPage = () => {
  // Desestructuramos TODOS los parámetros de la URL
  const { idPaciente, idHistorial, idOdontograma } = useParams();
  const navigate = useNavigate();

  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para ir al detalle de un diente concreto
  const irADetalle = (idDetalle) => {
    navigate(
      `/pacientes/${idPaciente}` +
      `/historial/${idHistorial}` +
      `/odontograma/${idOdontograma}` +
      `/detalle/${idDetalle}`
    );
  };

  useEffect(() => {
    if (!idOdontograma) return;

    getDetallesByOdontograma(idOdontograma)
      .then(data => setDetalles(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [idOdontograma]);

  if (loading) {
    return (
      <AdminLayout>
        <p>Cargando detalles del odontograma…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="odontograma-detalle-container">
        <h2>Odontograma #{idOdontograma} — Detalle de piezas</h2>

        {detalles.length === 0 ? (
          <p>No hay registro de dientes para este odontograma.</p>
        ) : (
          <ul className="dientes-list">
            {detalles.map(d => (
              <li key={d.idDetalle} className="diente-item">
                <span className="diente-numero">Diente {d.numeroPiezaDental}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};
