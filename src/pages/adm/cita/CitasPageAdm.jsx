// src/pages/Citas/CitasPageAdm.jsx
import React, { useState } from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";// Ajusta el path según tu proyecto
import "./CitasPageAdm.css";

export const CitasPageAdm = () => {
  const [view, setView] = useState("calendario"); // calendario | nuevaCita
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Supón que tienes estos arrays de tu backend:
  const [citas, setCitas] = useState([]); // Citas filtradas por fecha

  // Opcional: si usas Redux, puedes sacar datos de pacientes, odontólogos y servicios del store.
  const pacientes = [
    // Demo
    { id: 1, nombre: "Carlos Smith Valencia" },
  ];
  const odontologos = [
    { id: 1, nombre: "Dra. Sofía Pérez" },
  ];
  const servicios = [
    { id: 1, nombre: "Limpieza dental" },
  ];

  // Estados para el formulario de nueva cita
  const [form, setForm] = useState({
    paciente: "",
    odontologo: "",
    servicio: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  // Handler para cambios en inputs
  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    // Filtrar citas por fecha aquí
    setCitas([]); // Cambia por tus datos reales
  };

  const handleProgramarCita = e => {
    e.preventDefault();
    // Aquí el submit para crear la cita
    alert("Cita programada (ejemplo)");
    setView("calendario");
  };

  return (
    <AdminLayout>
      <div className="citas-container">
        <h2 className="titulo-citas">Gestión de Citas</h2>
        <p className="subtitulo-citas">Programa, confirme o cancele citas</p>
        <div className="citas-tabs">
          <button
            className={`tab-btn ${view === "calendario" ? "active" : ""}`}
            onClick={() => setView("calendario")}
          >
            Calendario
          </button>
          <button
            className={`tab-btn ${view === "nuevaCita" ? "active" : ""}`}
            onClick={() => setView("nuevaCita")}
          >
            Nueva Cita
          </button>
        </div>
        {view === "calendario" ? (
          <div className="citas-body">
            <div className="calendar-card">
              <h4>Calendario</h4>
              {/* Aquí deberías usar tu componente de calendario real */}
              <input
                type="date"
                value={selectedDate.toISOString().substr(0, 10)}
                onChange={e => handleDateChange(new Date(e.target.value))}
                className="input-date"
              />
            </div>
            <div className="citas-card">
              <h4>
                Citas para {selectedDate.toLocaleDateString("es-ES")}
              </h4>
              {citas.length === 0 ? (
                <>
                  <p>No hay citas programadas para esta fecha</p>
                  <button className="btn-primary" onClick={() => setView("nuevaCita")}>
                    Nueva Cita
                  </button>
                </>
              ) : (
                // Aquí lista de citas
                <ul>
                  {citas.map((cita, idx) => (
                    <li key={idx}>{/* Renderiza la cita */}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <form className="nueva-cita-form" onSubmit={handleProgramarCita}>
            <h3>Programar Nueva Cita</h3>
            <div className="form-group">
              <label>Paciente</label>
              <select name="paciente" value={form.paciente} onChange={handleInputChange} required>
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Odontólogo</label>
              <select name="odontologo" value={form.odontologo} onChange={handleInputChange} required>
                <option value="">Seleccionar odontólogo</option>
                {odontologos.map(o => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Servicio</label>
              <select name="servicio" value={form.servicio} onChange={handleInputChange} required>
                <option value="">Seleccionar servicio</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group fecha-hora">
              <div>
                <label>Fecha</label>
                <input type="date" name="fecha" value={form.fecha} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Hora</label>
                <input type="time" name="hora" value={form.hora} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Notas</label>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleInputChange}
                placeholder="Notas adicionales sobre la cita"
              ></textarea>
            </div>
            <button className="btn-primary" type="submit">
              Programar Cita
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
