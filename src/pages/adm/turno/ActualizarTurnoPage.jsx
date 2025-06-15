import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneTurno, updateTurno } from "../../../services/turno.service";

import { AdminLayout } from "../../../components/layouts/AdminLayout";

export const ActualizarTurnoPage = () => {
  const { idTurno } = useParams();
  const navigate = useNavigate();

  const [nombreTurno, setNombreTurno] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [habilitado, setHabilitado] = useState(true);

  useEffect(() => {
      getOneTurno(idTurno)
      .then((turno) => {
        setNombreTurno(turno.nombreTurno);
        setHoraInicio(turno.horaInicio);
        setHoraFin(turno.horaFin);
        setHabilitado(turno.habilitado);
      })
      .catch((err) => {
        console.error("Error cargando turno:", err);
        alert("No se pudo cargar el turno.");
      });
  }, [idTurno]);

function formatTime(value) {
  // Si ya está bien, no cambia nada. Si viene con segundos, lo recorta.
  if (!value) return value;
  return value.length > 5 ? value.slice(0, 5) : value;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const turnoActualizado = {};
  if (nombreTurno) turnoActualizado.nombreTurno = nombreTurno;
  if (horaInicio) turnoActualizado.horaInicio = formatTime(horaInicio);
  if (horaFin) turnoActualizado.horaFin = formatTime(horaFin);
  if (typeof habilitado === "boolean") turnoActualizado.habilitado = habilitado;

  console.log("Payload enviado:", turnoActualizado);

  try {
    await updateTurno(idTurno, turnoActualizado);
    alert("Turno actualizado correctamente");
    navigate("/turnos");
  } catch (error) {
    console.error("Error actualizando turno:", error);
    alert("Error al actualizar turno");
  }
};



  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow rounded-md mt-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Actualizar Turno
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Turno
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={nombreTurno}
              onChange={(e) => setNombreTurno(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Inicio
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Fin
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={habilitado}
              onChange={(e) => setHabilitado(e.target.checked)}
              className="mr-2"
            />
            <label>¿Turno habilitado?</label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/turnos")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Actualizar Turno
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
