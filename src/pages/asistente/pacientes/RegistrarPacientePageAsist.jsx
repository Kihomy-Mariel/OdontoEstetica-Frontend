import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerPaciente, getOnePaciente, updatePaciente } from "../../../services/paciente.service";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { getCitas } from "../../../services/cita.service"
export const RegistrarPacientePageAsist = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    alergias: "",
  });

  useEffect(() => {
    if (id) {
      // Cargar datos para editar
      getOnePaciente(id).then(data => {
        setForm({
          nombres: data.persona?.nombres || "",
          apellidoPaterno: data.persona?.apellidoPaterno || "",
          apellidoMaterno: data.persona?.apellidoMaterno || "",
          ci: data.persona?.ci || "",
          fechaNacimiento: data.persona?.fechaNacimiento || "",
          telefono: data.persona?.telefono || "",
          email: data.persona?.email || "",
          alergias: data.alergias || "",
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (id) {
        await updatePaciente(id, form);
      } else {
        await registerPaciente(form);
      }
      navigate("/asistente/pacientes");
    } catch (error) {
      alert("Error guardando paciente: " + error.message);
    }
  };

  return (
    <AsistLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          {id ? "Editar Paciente" : "Nuevo Paciente"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombres"
              placeholder="Nombres"
              value={form.nombres}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              name="apellidoPaterno"
              placeholder="Apellido Paterno"
              value={form.apellidoPaterno}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={form.apellidoMaterno}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              name="ci"
              placeholder="Carnet de Identidad"
              value={form.ci}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="date"
              name="fechaNacimiento"
              placeholder="Fecha de Nacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              name="alergias"
              placeholder="Alergias"
              value={form.alergias}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/asistente/pacientes")}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </AsistLayout>
  );
};
