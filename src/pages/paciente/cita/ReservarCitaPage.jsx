import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PacienteLayout } from "../../../components/layouts/PacienteLayout";
import { createCita } from "../../../services/cita.service";
import { createCitaServicio } from "../../../services/cita-servicio.service";
import { getAllServicios as getServicios } from "../../../services/servicio.service";
import { getPersonaById } from "../../../services/persona.service";
import { useAuth } from "../../../hooks/useAuth";


export const ReservarCitaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // AQUÍ EL PACIENTE DIRECTO DEL OBJETO USER
  const paciente = {
    idPersona: user?.idPersona,
    idPaciente: user?.idPersona,      // ← alias claro
    nombre: user?.nombre,
    apellidoPaterno: user?.apellidoPaterno,
    apellidoMaterno: user?.apellidoMaterno,
  };


  const [form, setForm] = useState({
    idServicio: "",
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: "",
    cantidadServicio: 1,
    precioAplicado: "",
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getServicios().then(setServicios);
  }, []);

  useEffect(() => {
    if (form.idServicio && servicios.length) {
      const s = servicios.find(s => s.idServicio === Number(form.idServicio));
      setForm(f => ({
        ...f,
        precioAplicado: s?.precio || "",
        motivo: s?.nombreServicio || ""
      }));
    }
  }, [form.idServicio, servicios]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(""); setMensaje("");
    try {
      const citaPayload = {
        idPaciente: Number(paciente.idPaciente), // 7
        idAgenda: 1,
        motivo: form.motivo,
        fecha: form.fecha,
        hora: form.hora,
      };  // ← debe mostrar 7
      const citaCreada = await createCita(citaPayload);


      await createCitaServicio({
        idCita: citaCreada.idCita,
        idServicio: Number(form.idServicio),
        precioAplicado: Number(form.precioAplicado),
        cantidadServicio: Number(form.cantidadServicio),
        observaciones: form.observaciones,
      });

      setMensaje("¡Tu cita fue reservada exitosamente! 🎉");
      setTimeout(() => navigate("/inicio-paciente"), 1000);
    } catch (err) {
      setError("Ocurrió un error al reservar la cita. Por favor, revisa tus datos.");
    } finally {
      setLoading(false);
    }
  };
  console.log("paciente", paciente);


  return (
    <PacienteLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-7">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-1 text-center">
            Reservar Cita Dental
          </h1>
          <p className="text-blue-600 text-center mb-5">
            Completa los datos para tu próxima cita
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Paciente */}
            <div>
              <label className="block text-blue-700 font-medium mb-1">Paciente</label>
              <input
                type="text"
                disabled
                value={
                  paciente.nombre
                    ? `${paciente.nombre} ${paciente.apellidoPaterno || ""} ${paciente.apellidoMaterno || ""}`.trim()
                    : "No identificado"
                }
                className="w-full border border-blue-200 rounded-lg p-3 bg-blue-50 text-blue-700 cursor-not-allowed"
              />
            </div>

            {/* Servicio */}
            <div>
              <label className="block text-blue-700 font-medium mb-1">Servicio</label>
              <select
                name="idServicio"
                value={form.idServicio}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecciona el servicio</option>
                {servicios.map(s => (
                  <option key={s.idServicio} value={s.idServicio}>
                    {s.nombreServicio}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  required
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-blue-700 font-medium mb-1">Motivo</label>
              <input
                type="text"
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
                placeholder="Motivo de la cita"
                className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Precio y cantidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-700 font-medium mb-1">Precio estimado</label>
                <input
                  type="number"
                  name="precioAplicado"
                  value={form.precioAplicado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  readOnly
                  style={{ background: "#f0f6ff" }}
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidadServicio"
                  value={form.cantidadServicio}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-blue-700 font-medium mb-1">Observaciones</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={2}
                className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                placeholder="(Opcional)"
              />
            </div>

            {/* Mensajes */}
            {error && (
              <div className="text-red-600 bg-red-100 rounded p-2 text-center">
                {error}
              </div>
            )}
            {mensaje && (
              <div className="text-green-600 bg-green-100 rounded p-2 text-center">
                {mensaje}
              </div>
            )}

            <div className="flex flex-row gap-2 pt-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/inicio-paciente")}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-bold disabled:opacity-60"
              >
                {loading ? "Reservando..." : "Reservar cita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PacienteLayout>
  );
};
