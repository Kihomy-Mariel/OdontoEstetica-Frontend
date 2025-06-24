import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getCitasByFecha, updateCita, softDeleteCita } from "../../../services/cita.service";
import { getAllPacientes as getPacientes } from "../../../services/paciente.service";
import { getAllServicios as getServicios } from "../../../services/servicio.service";
import { Calendar } from "react-calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";

const TrashIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} width={28} height={28}>
    <path d="M6 7v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M3 7h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const estadoLabel = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-400",
  CONFIRMADA: "bg-green-100 text-green-800 border-green-400",
  CANCELADA: "bg-red-100 text-red-700 border-red-400",
};

export const CitasPageAdm = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCell, setEditCell] = useState({ idCita: null, field: null });
  const [editValue, setEditValue] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState(null);
  const datePickerRef = useRef();

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const fechaFormateada = selectedDate.toISOString().split("T")[0];
      const citasData = await getCitasByFecha(fechaFormateada);
      setCitas(Array.isArray(citasData) ? citasData.filter(c => c.habilitado) : []);
      setError(null);
    } catch {
      setError("Error al cargar las citas. Intente nuevamente.");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch {
      setPacientes([]);
    }
  };

  const fetchServicios = async () => {
    try {
      const data = await getServicios();
      setServicios(data);
    } catch {
      setServicios([]);
    }
  };

  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line
  }, [selectedDate]);

  // Cuando editas, carga selects
  const handleEditCell = (idCita, field, value) => {
    setEditCell({ idCita, field });
    setEditValue(value);
    if (field === "idPaciente" && pacientes.length === 0) fetchPacientes();
    if (field === "servicio" && servicios.length === 0) fetchServicios();
    if (field === "fecha") setDatePickerOpen(idCita);
  };

  // Guarda cambios
  const saveEdit = async (idCita) => {
    let payload = {};
    if (editCell.field === "hora" || editCell.field === "motivo" || editCell.field === "estado") {
      payload[editCell.field] = editValue;
    } else if (editCell.field === "fecha") {
      // de Date a YYYY-MM-DD
      if (editValue instanceof Date) {
        payload.fecha = editValue.toISOString().split("T")[0];
      }
    } else if (editCell.field === "idPaciente") {
      payload.idPaciente = Number(editValue);
    } else if (editCell.field === "servicio") {
      payload.motivo = servicios.find(s => s.idServicio === Number(editValue))?.nombreServicio || "";
    }
    try {
      setLoading(true);
      await updateCita(idCita, payload);
      await fetchCitas();
      setEditCell({ idCita: null, field: null });
      setDatePickerOpen(null);
    } catch {
      setError("No se pudo actualizar el campo.");
    } finally {
      setLoading(false);
    }
  };

  // Borrado lógico
  const handleDelete = async (idCita) => {
    try {
      setLoading(true);
      await softDeleteCita(idCita);
      await fetchCitas();
    } catch {
      setError("No se pudo eliminar la cita.");
    } finally {
      setLoading(false);
    }
  };

  // UX: Guardar al salir
  const handleInputBlur = (idCita) => {
    setTimeout(() => { // timeout para permitir seleccionar en el calendar
      if (editCell.field !== "fecha") saveEdit(idCita);
    }, 120);
  };

  const handleInputKey = (e, idCita) => {
    if (e.key === "Enter") saveEdit(idCita);
    if (e.key === "Escape") {
      setEditCell({ idCita: null, field: null });
      setDatePickerOpen(null);
    }
  };

  const getPacienteNombre = (cita) =>
    cita.paciente?.persona
      ? `${cita.paciente.persona.nombres} ${cita.paciente.persona.apellidoPaterno ?? ""} ${cita.paciente.persona.apellidoMaterno ?? ""}`.trim()
      : "Sin paciente";

  // Fecha en DD-MM-YYYY
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [yyyy, mm, dd] = fecha.split("-");
    if (yyyy && mm && dd) return `${dd}-${mm}-${yyyy}`;
    return fecha;
  };

  // Convierte a Date para el datepicker
  const toDateObj = (fecha) => {
    if (!fecha) return null;
    const [yyyy, mm, dd] = fecha.split("-");
    return new Date(yyyy, mm - 1, dd);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">Gestión de Citas</h1>
              <p className="text-blue-700 mt-1">Consulta, edita y gestiona las citas odontológicas.</p>
            </div>
            <button
              onClick={() => navigate("/cita-nueva")}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all"
            >
              + Nueva Cita
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Calendario */}
            <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-blue-800 mb-2 text-center">Selecciona una fecha</h2>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                locale="es-ES"
                className="rounded-lg border border-blue-200"
                tileClassName={({ date }) =>
                  date.toDateString() === selectedDate.toDateString()
                    ? "bg-blue-100 text-blue-800 font-bold"
                    : ""
                }
              />
            </div>

            {/* Lista de citas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Citas para{" "}
                  <span className="capitalize">
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">{error}</div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                  </div>
                ) : citas.length === 0 ? (
                  <div className="text-center py-10 text-blue-400 font-medium">
                    No hay citas programadas para esta fecha.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-100">
                      <thead>
                        <tr className="bg-blue-50 text-blue-900">
                          <th className="py-2 px-4 text-sm font-semibold">#</th>
                          <th className="py-2 px-4 text-sm font-semibold w-36">Fecha</th>
                          <th className="py-2 px-4 text-sm font-semibold">Hora</th>
                          <th className="py-2 px-4 text-sm font-semibold">Motivo</th>
                          <th className="py-2 px-4 text-sm font-semibold">Paciente</th>
                          <th className="py-2 px-4 text-sm font-semibold">Servicio</th>
                          <th className="py-2 px-4 text-sm font-semibold">Estado</th>
                          <th className="py-2 px-4 text-sm font-semibold text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {citas.map((cita, i) => (
                          <tr key={cita.idCita} className="hover:bg-blue-50 transition-colors">
                            <td className="py-2 px-4 text-center">{i + 1}</td>
                            {/* Fecha editable */}
                            <td className="py-2 px-4 text-center cursor-pointer relative min-w-[120px]">
                              {editCell.idCita === cita.idCita && editCell.field === "fecha" ? (
                                <div ref={datePickerRef} className="relative z-20">
                                  <DatePicker
                                    selected={editValue ? (editValue instanceof Date ? editValue : toDateObj(editValue)) : toDateObj(cita.fecha)}
                                    onChange={(date) => {
                                      setEditValue(date);
                                      setTimeout(() => saveEdit(cita.idCita), 150);
                                    }}
                                    onBlur={() => setDatePickerOpen(null)}
                                    dateFormat="dd-MM-yyyy"
                                    className="border-blue-300 border rounded p-1 w-32 text-center"
                                    autoFocus
                                    open={datePickerOpen === cita.idCita}
                                    onClickOutside={() => setDatePickerOpen(null)}
                                    withPortal
                                    popperPlacement="bottom"
                                  />
                                </div>
                              ) : (
                                <span
                                  onDoubleClick={() => handleEditCell(cita.idCita, "fecha", cita.fecha)}
                                  className="block w-full px-2 py-1 rounded-lg hover:bg-blue-100 transition"
                                  style={{ letterSpacing: 1 }}
                                >
                                  {formatFecha(cita.fecha)}
                                </span>
                              )}
                            </td>
                            {/* Hora editable */}
                            <td className="py-2 px-4 text-center font-mono text-blue-700 cursor-pointer">
                              {editCell.idCita === cita.idCita && editCell.field === "hora" ? (
                                <input
                                  type="time"
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleInputBlur(cita.idCita)}
                                  onKeyDown={e => handleInputKey(e, cita.idCita)}
                                  className="border-blue-300 border rounded p-1"
                                />
                              ) : (
                                <span onDoubleClick={() => handleEditCell(cita.idCita, "hora", cita.hora)}>{cita.hora?.substring(0, 5)}</span>
                              )}
                            </td>
                            {/* Motivo editable */}
                            <td className="py-2 px-4 cursor-pointer">
                              {editCell.idCita === cita.idCita && editCell.field === "motivo" ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleInputBlur(cita.idCita)}
                                  onKeyDown={e => handleInputKey(e, cita.idCita)}
                                  className="border-blue-300 border rounded p-1 w-full"
                                />
                              ) : (
                                <span onDoubleClick={() => handleEditCell(cita.idCita, "motivo", cita.motivo)}>{cita.motivo}</span>
                              )}
                            </td>
                            {/* Paciente editable */}
                            <td className="py-2 px-4 cursor-pointer">
                              {editCell.idCita === cita.idCita && editCell.field === "idPaciente" ? (
                                <select
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleInputBlur(cita.idCita)}
                                  onKeyDown={e => handleInputKey(e, cita.idCita)}
                                  className="border-blue-300 border rounded p-1 w-full"
                                >
                                  <option value="">Seleccionar paciente</option>
                                  {pacientes.map(p => (
                                    <option key={p.idPaciente} value={p.idPaciente}>
                                      {p.persona?.nombres} {p.persona?.apellidoPaterno} {p.persona?.apellidoMaterno}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span onDoubleClick={() => handleEditCell(cita.idCita, "idPaciente", cita.idPaciente)}>{getPacienteNombre(cita)}</span>
                              )}
                            </td>
                            {/* Servicio editable */}
                            <td className="py-2 px-4 cursor-pointer">
                              {editCell.idCita === cita.idCita && editCell.field === "servicio" ? (
                                <select
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleInputBlur(cita.idCita)}
                                  onKeyDown={e => handleInputKey(e, cita.idCita)}
                                  className="border-blue-300 border rounded p-1 w-full"
                                >
                                  <option value="">Seleccionar servicio</option>
                                  {servicios.map(s => (
                                    <option key={s.idServicio} value={s.idServicio}>{s.nombreServicio}</option>
                                  ))}
                                </select>
                              ) : (
                                <span onDoubleClick={() => handleEditCell(cita.idCita, "servicio", (cita.citaServicios?.[0]?.servicio?.idServicio || ""))}>
                                  {(cita.citaServicios && cita.citaServicios.length > 0)
                                    ? cita.citaServicios.map(cs => cs.servicio?.nombreServicio).join(", ")
                                    : "-"}
                                </span>
                              )}
                            </td>
                            {/* Estado editable */}
                            <td className="py-2 px-4 text-center cursor-pointer">
                              {editCell.idCita === cita.idCita && editCell.field === "estado" ? (
                                <select
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleInputBlur(cita.idCita)}
                                  className={
                                    "border-2 rounded-lg shadow text-sm font-semibold text-center w-32 " +
                                    (estadoColors[editValue] || "bg-gray-100 text-gray-700 border-gray-300")
                                  }
                                  style={{ fontWeight: "bold", letterSpacing: 1, outline: 0 }}
                                >
                                  <option value="CONFIRMADA" className="text-green-800 bg-green-100">Confirmada</option>
                                  <option value="CANCELADA" className="text-red-700 bg-red-100">Cancelada</option>
                                  <option value="PENDIENTE" className="text-yellow-800 bg-yellow-100">Pendiente</option>
                                </select>
                              ) : (
                                <span
                                  onDoubleClick={() => handleEditCell(cita.idCita, "estado", cita.estado)}
                                  className={
                                    "px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all " +
                                    (estadoColors[cita.estado] || "bg-gray-100 text-gray-700 border-gray-300")
                                  }
                                >
                                  {estadoLabel[cita.estado]}
                                </span>
                              )}
                            </td>
                            {/* Botón de eliminar */}
                            <td className="py-2 px-4 text-center">
                              <button
                                onClick={() => handleDelete(cita.idCita)}
                                className="p-2 rounded-full hover:bg-red-100 transition-all shadow-sm"
                                title="Eliminar cita"
                              >
                                <TrashIcon className="text-red-500 hover:text-red-700 drop-shadow" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
