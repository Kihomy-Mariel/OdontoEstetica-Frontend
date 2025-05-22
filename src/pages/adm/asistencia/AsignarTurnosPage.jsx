// src/pages/adm/asistencia/AsignarTurnosPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneEmpleado } from "../../../services/empleado.service";
import { getAllTurnos } from "../../../services/turno.service";
import { asignarAsistencia } from "../../../services/asistencia.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import "./AsignarTurnosPage.css";

export const AsignarTurnoPage = () => {
  const { idEmpleado } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [form, setForm] = useState({
    idTurno: "",
    horaLlegada: "",
    horaSalida: "",
    diaSemana: "lunes",
  });

  useEffect(() => {
    // 1) Cargo datos del empleado
    getOneEmpleado(idEmpleado).then(setEmpleado);

    // 2) Cargo todos los turnos
    getAllTurnos()
      .then(setTurnos)
      .catch(console.error);
  }, [idEmpleado]);

  const dias = [
    "lunes", "martes", "miercoles",
    "jueves", "viernes", "sabado", "domingo"
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await asignarAsistencia({
        idEmpleado: Number(idEmpleado),
        ...form,
        idTurno: Number(form.idTurno),
      });
      alert("✅ Turno asignado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al asignar turno");
    }
  };

  return (
    <AdminLayout>
      <div className="asignar-turno-container">
        <h2>
          Asignar Turno a{" "}
          {empleado
            ? `${empleado.persona.nombres} ${empleado.persona.apellidoPaterno}`
            : "..." }
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Turno</label>
          <select
            name="idTurno"
            value={form.idTurno}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un turno --</option>
            {turnos.map(t => (
              <option key={t.idTurno} value={t.idTurno}>
                {t.nombreTurno} ({t.horaInicio} - {t.horaFin})
              </option>
            ))}
          </select>

          <label>Hora de Llegada</label>
          <input
            type="time"
            name="horaLlegada"
            value={form.horaLlegada}
            onChange={handleChange}
            required
          />

          <label>Hora de Salida</label>
          <input
            type="time"
            name="horaSalida"
            value={form.horaSalida}
            onChange={handleChange}
            required
          />

          <label>Día de la Semana</label>
          <select
            name="diaSemana"
            value={form.diaSemana}
            onChange={handleChange}
          >
            {dias.map(d => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-submit">
            Asignar Turno
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
