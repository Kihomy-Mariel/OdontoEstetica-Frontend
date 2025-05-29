import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { crearServicio } from "../../../services/servicio.service";
import "./RegistrarServicioAdm.css";

export const RegistrarServicioAdm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreServicio: "",
    descripcion: "",
    duracionEstimada: "",
    precio: "",
    // habilitado: true, // Si tu backend lo pone por defecto, omite este campo aquí
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        // habilitado: true, // Solo si lo necesitas, pero lo normal es que el backend lo asigne
      };
      await crearServicio(payload);
      navigate("/servicios");
    } catch (err) {
      setError("Error al registrar el servicio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="registrar-servicio-container">
        <h2>Registrar Nuevo Servicio</h2>
        {error && <div className="error">{error}</div>}
        <form className="registrar-servicio-form" onSubmit={handleSubmit}>
          <label>
            Nombre del servicio:
            <input
              name="nombreServicio"
              value={form.nombreServicio}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripción:
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duración estimada:
            <input
              name="duracionEstimada"
              value={form.duracionEstimada}
              onChange={handleChange}
              required
              placeholder="Ej: 30 minutos"
            />
          </label>
          <label>
            Precio:
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </label>
          <div style={{ marginTop: 18 }}>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/servicios")}
              style={{ marginLeft: 12 }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
