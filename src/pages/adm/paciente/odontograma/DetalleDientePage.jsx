// src/pages/adm/odontograma/DetalleDientePage.jsx
import { useEffect, useState } from "react";
import { useParams }               from "react-router-dom";
import { getOneDetalle } from "../../../../services/odontograma-detalle.service";
import { AdminLayout } from "../../../../components/layouts/AdminLayout";

export const DetalleDientePage = () => {
  const { idDetalle } = useParams();
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    if (!idDetalle) return;
    getOneDetalle(idDetalle).then(setDetalle);
  }, [idDetalle]);

  if (!detalle) return <AdminLayout>…Cargando…</AdminLayout>;

  return (
    <AdminLayout>
      <h2>Diente {detalle.numeroPiezaDental}</h2>
      <p><strong>Estado:</strong> {detalle.estado}</p>
      <p><strong>Obs.:</strong> {detalle.observaciones}</p>
    </AdminLayout>
  );
};
