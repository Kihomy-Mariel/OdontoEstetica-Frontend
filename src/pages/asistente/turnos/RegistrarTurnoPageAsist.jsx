import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTurno } from "../../../services/turno.service";
import { AsistLayout } from "../../../components/layouts/AsistLayout";

 export const RegistrarTurnoPageAsist = () => {
  const [nombreTurno, setNombreTurno] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

      const turnoData = {
    nombreTurno,
    horaInicio,
    horaFin,
    habilitado: true, // ✅ Asegura el valor requerido
  };

  console.log("📤 Datos enviados al backend:", turnoData);

    try {
      await createTurno(turnoData);
      alert("Turno registrado correctamente");
      navigate("/asistente/turnos");
    } catch (error) {
      console.error("Error registrando turno:", error);
      alert("Error al registrar turno");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow rounded-md mt-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Registrar Nuevo Turno
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Turno
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombreTurno}
              onChange={(e) => setNombreTurno(e.target.value)}
              required
              placeholder="Ej: Turno Mañana"
            />
          </div>

          {/* Hora de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Inicio
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>

          {/* Hora de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Fin
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/asistente/turnos")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Guardar Turno
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
