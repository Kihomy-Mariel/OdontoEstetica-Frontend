// src/pages/Servicios/EditarServicioPageAdm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getServicioById, updateServicio } from "../../../services/servicio.service";
import "./EditarServicioPageAdm.css";

export const EditarServicioPageAdm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServicioById(id)
      .then(data => {
        setServicio(data);
        setLoading(false);
      })
      .catch(err => {
        setError("No se pudo cargar el servicio");
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setServicio(s => ({
      ...s,
      [name]: type === "checkbox" ? checked : value
    }));
  };

const handleSubmit = async e => {
  e.preventDefault();
  setSaving(true);
  setError(null);

  // SOLO los campos que quieres actualizar
  const payload = {
    nombreServicio: servicio.nombreServicio,
    descripcion: servicio.descripcion,
    precio: Number(servicio.precio),
    duracionEstimada: servicio.duracionEstimada,
    // ¡No incluyas habilitado aquí!
  };

  try {
    await updateServicio(id, payload);
    navigate("/servicios");
  } catch (err) {
    setError("Error al guardar cambios.");
    console.error("ERROR BACKEND:", err);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 30, textAlign: "center" }}>Cargando...</div>
      </AdminLayout>
    );
  }

  if (!servicio) {
    return (
      <AdminLayout>
        <div style={{ padding: 30, color: "red" }}>No se encontró el servicio</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="editar-servicio-container">
        <h2>Editar Servicio</h2>
        {error && <div className="error">{error}</div>}
        <form className="editar-servicio-form" onSubmit={handleSubmit}>
          <label>
            Nombre del servicio:
            <input
              name="nombreServicio"
              value={servicio.nombreServicio}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripción:
            <input
              name="descripcion"
              value={servicio.descripcion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duración estimada:
            <input
              name="duracionEstimada"
              value={servicio.duracionEstimada}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Precio:
            <input
              name="precio"
              value={servicio.precio}
              type="number"
              step="0.01"
              min="0"
              onChange={handleChange}
              required
            />
          </label>

          <div style={{marginTop: 18}}>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/servicios")} style={{marginLeft: 12}}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
