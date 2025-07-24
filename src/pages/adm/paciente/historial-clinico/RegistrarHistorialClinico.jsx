import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOnePaciente } from "../../../../services/paciente.service";
import { createHistorialClinico } from "../../../../services/historial-clinico.service";
import { AdminLayout } from "../../../../components/layouts/AdminLayout";

export const RegistrarHistorialClinicoPage = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  const [form, setForm] = useState({
    idPaciente: Number(idPaciente),
    fechaRegistroHistorial: "",
    antecedentesMedicos: "",
    antecedentesOdontologicos: "",
    diagnostico: "",
    tratamientoPropuesto: "",
    tratamientoRealizado: "",
    observaciones: "",
    edadEnConsulta: "",
  });

  useEffect(() => {
    getOnePaciente(idPaciente)
      .then(setPaciente)
      .catch(console.error);
  }, [idPaciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHistorialClinico({
        ...form,
        edadEnConsulta: Number(form.edadEnConsulta),
      });
      alert("✅ Historial clínico registrado");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar historial clínico");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto mt-6 bg-white p-8 shadow-xl rounded-3xl border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
          Registrar Historial Clínico
        </h2>
        <p className="text-blue-600 text-center mb-6">
          Complete los siguientes campos para registrar el historial del paciente
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Paciente */}
          <div>
            <label className="block text-blue-700 font-medium mb-1">Paciente</label>
            <input
              type="text"
              disabled
              value={
                paciente
                  ? `${paciente.persona.nombres} ${paciente.persona.apellidoPaterno}`
                  : "Cargando..."
              }
              className="w-full border border-blue-300 bg-blue-50 text-blue-800 p-3 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Fecha y Edad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-700 font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="fechaRegistroHistorial"
                value={form.fechaRegistroHistorial}
                onChange={handleChange}
                required
                className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-blue-700 font-medium mb-1">Edad en Consulta</label>
              <input
                type="number"
                name="edadEnConsulta"
                value={form.edadEnConsulta}
                onChange={handleChange}
                min={0}
                required
                className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Textareas */}
          <div>
            <label className="block text-blue-700 font-medium mb-1">Antecedentes Médicos</label>
            <textarea
              name="antecedentesMedicos"
              value={form.antecedentesMedicos}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-1">Antecedentes Odontológicos</label>
            <textarea
              name="antecedentesOdontologicos"
              value={form.antecedentesOdontologicos}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-blue-700 font-medium mb-1">Diagnóstico</label>
            <input
              type="text"
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              required
              placeholder="Diagnóstico del paciente"
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tratamientos */}
          <div>
            <label className="block text-blue-700 font-medium mb-1">Tratamiento Propuesto</label>
            <input
              type="text"
              name="tratamientoPropuesto"
              value={form.tratamientoPropuesto}
              onChange={handleChange}
              required
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-1">Tratamiento Realizado</label>
            <input
              type="text"
              name="tratamientoRealizado"
              value={form.tratamientoRealizado}
              onChange={handleChange}
              required
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-blue-700 font-medium mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={2}
              className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="(Opcional)"
            />
          </div>

          {/* Botón */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
