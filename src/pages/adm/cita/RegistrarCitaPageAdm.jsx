import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { createCita } from "../../../services/cita.service";
import { createCitaServicio } from "../../../services/cita-servicio.service";
import { getAllPacientes as getPacientes } from "../../../services/paciente.service";
import { getAllServicios as getServicios } from "../../../services/servicio.service";

export const RegistrarCitaPageAdm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    idPaciente: "",
    idServicio: "",
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: "",
    cantidadServicio: 1,
    precioAplicado: "",
  });

  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar pacientes y servicios al montar
  useEffect(() => {
    getPacientes().then(setPacientes);
    getServicios().then(setServicios);
  }, []);

  // Cuando selecciona servicio, auto-carga precio
  useEffect(() => {
    if (form.idServicio && servicios.length) {
      const s = servicios.find(s => s.idServicio === Number(form.idServicio));
      setForm(f => ({ ...f, precioAplicado: s?.precio || "" }));
      setForm(f => ({ ...f, motivo: s?.nombreServicio || "" }));
    }
    // eslint-disable-next-line
  }, [form.idServicio]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(""); setMensaje("");
    try {
      // Paso 1: crear la cita
      const citaPayload = {
        idPaciente: Number(form.idPaciente),
        // Aquí debes decidir cómo enlazar idAgenda si tu backend lo requiere
        idAgenda: 1, // <-- Cambia según tu lógica de agenda, aquí va 1 como ejemplo
        motivo: form.motivo,
        fecha: form.fecha,
        hora: form.hora,
      };
      const citaCreada = await createCita(citaPayload);

      // Paso 2: crear el cita-servicio
      await createCitaServicio({
        idCita: citaCreada.idCita,
        idServicio: Number(form.idServicio),
        precioAplicado: Number(form.precioAplicado),
        cantidadServicio: Number(form.cantidadServicio),
        observaciones: form.observaciones,
      });

      setMensaje("¡Cita registrada exitosamente!");
      setTimeout(() => navigate("/citas"), 1300);
    } catch (err) {
      setError("Ocurrió un error al registrar la cita. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-xl p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2 text-center">Registrar Nueva Cita</h1>
          <p className="text-blue-600 text-center mb-6">Completa los datos para programar una cita</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Paciente */}
            <div>
              <label className="block text-blue-700 font-medium mb-1">Paciente</label>
              <select
                name="idPaciente"
                value={form.idPaciente}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecciona paciente</option>
                {pacientes.map(p => (
                  <option key={p.idPaciente} value={p.idPaciente}>
                    {p.persona?.nombres} {p.persona?.apellidoPaterno} {p.persona?.apellidoMaterno}
                  </option>
                ))}
              </select>
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
                <option value="">Selecciona servicio</option>
                {servicios.map(s => (
                  <option key={s.idServicio} value={s.idServicio}>{s.nombreServicio}</option>
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
                <label className="block text-blue-700 font-medium mb-1">Precio aplicado</label>
                <input
                  type="number"
                  name="precioAplicado"
                  value={form.precioAplicado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Cantidad de servicio</label>
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

            {error && <div className="text-red-600 bg-red-100 rounded p-2 text-center">{error}</div>}
            {mensaje && <div className="text-green-600 bg-green-100 rounded p-2 text-center">{mensaje}</div>}

            <div className="flex flex-row gap-2 pt-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/citas")}
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
                {loading ? "Guardando..." : "Registrar cita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
