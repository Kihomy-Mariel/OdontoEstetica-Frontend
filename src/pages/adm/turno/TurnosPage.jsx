import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { getAllTurnos, deleteTurno } from "../../../services/turno.service";
import { getAllAsistencias } from "../../../services/asistencia.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import {
  CalendarDays,
  ClipboardList,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Clock4,
  User,
  Users,
} from "lucide-react";

export const TurnosPage = () => {
  const [tab, setTab] = useState("calendar");
  const [date, setDate] = useState(new Date());
  const [asistencias, setAsistencias] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllAsistencias().then(setAsistencias).catch(console.error);
    getAllTurnos().then(setTurnos);
  }, []);

  const handleDelete = async (id) => {
    if (confirm("¿Deshabilitar este turno?")) {
      await deleteTurno(id);
      setTurnos(turnos.filter((t) => t.idTurno !== id));
    }
  };

  const turnosFiltrados = turnos.filter((t) =>
    `${t.idTurno} ${t.nombreTurno} ${t.horaInicio} ${t.horaFin}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2 mb-6">
          <ClipboardList size={32} className="text-blue-500" />
          Gestión de Turnos
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition ${
              tab === "calendar"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-100 text-blue-700"
            }`}
            onClick={() => setTab("calendar")}
          >
            <CalendarDays size={20} />
            Calendario de Turnos
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition ${
              tab === "assign"
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-100 text-blue-700"
            }`}
            onClick={() => setTab("assign")}
          >
            <ClipboardList size={20} />
            Turnos
          </button>
        </div>

        {/* Calendario */}
        {tab === "calendar" && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="bg-white rounded shadow p-6 w-full lg:w-1/2">
              <h3 className="text-xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <CalendarDays size={20} className="text-blue-400" />
                Calendario
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Selecciona una fecha para ver los turnos asignados
              </p>
              <Calendar onChange={setDate} value={date} />
            </div>

            <div className="bg-white rounded shadow p-6 w-full lg:w-1/2">
              <h3 className="text-xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                Turnos registrados el {date.toLocaleDateString()}
              </h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <Clock4 size={16} /> {asistencias.length} turnos asignados
              </p>
              <ul className="space-y-4">
                {asistencias.map((a) => (
                  <li
                    key={`${a.idEmpleado}-${a.idTurno}-${a.diaSemana}`}
                    className="border-b pb-2"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-medium text-blue-900 flex items-center gap-1">
                          <User size={16} />
                          {a.empleado.persona.nombres}{" "}
                          {a.empleado.persona.apellidoPaterno}{" "}
                          {a.empleado.persona.apellidoMaterno}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                          <ClipboardList size={14} />
                          {a.empleado.cargo}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle size={14} />
                          {a.empleado.especialidad}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2 mt-2 md:mt-0">
                        <Clock4 size={16} />
                        {a.turno.nombreTurno} - {a.horaLlegada} a {a.horaSalida}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabla de turnos */}
        {tab === "assign" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 text-blue-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar turno por nombre, hora, ID..."
                  className="border border-gray-300 rounded pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate("/turno/nuevo")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium shadow"
              >
                <PlusCircle size={18} />
                Nuevo Turno
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-blue-100 text-left text-sm">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Inicio</th>
                    <th className="px-4 py-2">Fin</th>
                    <th className="px-4 py-2">Activo</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosFiltrados.map((t) => (
                    <tr key={t.idTurno} className="border-t hover:bg-blue-50 transition">
                      <td className="px-4 py-2">{t.idTurno}</td>
                      <td className="px-4 py-2">{t.nombreTurno}</td>
                      <td className="px-4 py-2">{t.horaInicio}</td>
                      <td className="px-4 py-2">{t.horaFin}</td>
                      <td className="px-4 py-2">
                        {t.habilitado ? (
                          <CheckCircle className="text-green-600" size={18} />
                        ) : (
                          <XCircle className="text-red-600" size={18} />
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="text-yellow-500 hover:text-yellow-700 p-1 rounded transition"
                          onClick={() => navigate(`/turno/editar/${t.idTurno}`)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1 rounded transition"
                          onClick={() => handleDelete(t.idTurno)}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {turnosFiltrados.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-base font-medium">
                  <ClipboardList size={32} className="mx-auto mb-2" />
                  No se encontraron turnos con ese criterio.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
