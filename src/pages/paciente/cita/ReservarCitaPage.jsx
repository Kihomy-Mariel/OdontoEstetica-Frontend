// src/pages/paciente/ReservarCitaPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createCita } from "../../../services/cita.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import "./ReservarCitaPage.css";

export const ReservarCitaPage = () => {
  const navigate = useNavigate();
  const idPaciente = useSelector(s => s.usuario.id);
  const [form, setForm] = useState({
    idPaciente,
    fecha: "",
    hora: "",
    motivo: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createCita(form);
      alert("✅ Cita solicitada correctamente");
      navigate("/inicio-paciente");
    } catch {
      alert("❌ Error al solicitar cita");
    }
  };

  return (
    <AdminLayout>
      <div className="reservar-container">
        <h2>Reservar Cita</h2>
        <form onSubmit={handleSubmit} className="reservar-form">
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Motivo</label>
            <textarea
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Solicitar Cita
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
