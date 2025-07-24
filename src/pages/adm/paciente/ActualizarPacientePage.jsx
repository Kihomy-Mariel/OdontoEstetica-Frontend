import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOnePaciente, updatePaciente } from "../../../services/paciente.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { ShowAlert } from "../../../components/common/showAlerts/ShowAlert";
import { UserPlus } from "lucide-react";

const emptyPaciente = {
  persona: {
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
  },
  paciente: {
    alergias: "",
  },
  usuario: {
    username: "",
    // password: "", // No editar password aquí
  }
};

export const ActualizarPacientePage = () => {
  const { idPaciente } = useParams();
  const [form, setForm] = useState(emptyPaciente);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. Carga el paciente actual
  useEffect(() => {
    const cargarPaciente = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOnePaciente(idPaciente);
        setForm({
          persona: {
            nombres: data.persona?.nombres || "",
            apellidoPaterno: data.persona?.apellidoPaterno || "",
            apellidoMaterno: data.persona?.apellidoMaterno || "",
            ci: data.persona?.ci || "",
            fechaNacimiento: data.persona?.fechaNacimiento ? data.persona.fechaNacimiento.slice(0,10) : "",
            telefono: data.persona?.telefono.toString() || "",
            email: data.persona?.email || "",
          },
          paciente: {
            alergias: data.alergias || "", // puede ser data.paciente?.alergias si tu API lo anida
          },
          usuario: {
            username: data.persona?.usuario?.username || "",
          },
        });
      } catch (err) {
        setError("No se pudo cargar el paciente.");
      }
      setLoading(false);
    };
    cargarPaciente();
  }, [idPaciente]);

  // 2. Cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("persona.")) {
      setForm((f) => ({
        ...f,
        persona: { ...f.persona, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("paciente.")) {
      setForm((f) => ({
        ...f,
        paciente: { ...f.paciente, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("usuario.")) {
      setForm((f) => ({
        ...f,
        usuario: { ...f.usuario, [name.split(".")[1]]: value },
      }));
    }
  };

  // 3. Envío de la edición
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);
    try {
      await updatePaciente(parseInt(idPaciente), {
        persona: form.persona,
        paciente: form.paciente,
        usuario: form.usuario,
      });
      setMensaje("¡Paciente actualizado correctamente!");
      setTimeout(() => navigate("/pacientes"), 1500);
    } catch (err) {
      console.error("Error al actualizar paciente:", err.response?.data);
      setError(
        
        err?.response?.data?.message?.toString() ||
        "Ocurrió un error. Verifique los datos."
      );
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center min-h-[85vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-3">
        <div className="w-full max-w-xl rounded-3xl shadow-lg bg-white p-8 border border-blue-100">
          <div className="flex items-center mb-6 gap-3">
            <div className="bg-blue-100 rounded-full p-3">
              <UserPlus size={32} className="text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight">
              Editar paciente
            </h2>
          </div>

          {loading ? (
            <div className="text-blue-600 text-center py-6">Cargando...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-800 font-medium">Usuario *</label>
                  <input
                    name="usuario.username"
                    type="text"
                    required
                    value={form.usuario.username}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300"
                    autoComplete="off"
                    placeholder="Nombre de usuario"
                  />
                </div>
                {/* No incluimos password por seguridad */}
              </div>

              <div className="text-blue-700 font-semibold mt-6 mb-2">Datos personales</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-800">Nombres *</label>
                  <input
                    name="persona.nombres"
                    required
                    value={form.persona.nombres}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Nombres"
                  />
                </div>
                <div>
                  <label className="text-blue-800">Apellido Paterno *</label>
                  <input
                    name="persona.apellidoPaterno"
                    required
                    value={form.persona.apellidoPaterno}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Apellido paterno"
                  />
                </div>
                <div>
                  <label className="text-blue-800">Apellido Materno *</label>
                  <input
                    name="persona.apellidoMaterno"
                    required
                    value={form.persona.apellidoMaterno}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Apellido materno"
                  />
                </div>
                <div>
                  <label className="text-blue-800">CI *</label>
                  <input
                    name="persona.ci"
                    required
                    value={form.persona.ci}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Carnet de identidad"
                  />
                </div>
                <div>
                  <label className="text-blue-800">Fecha de Nacimiento *</label>
                  <input
                    name="persona.fechaNacimiento"
                    type="date"
                    required
                    value={form.persona.fechaNacimiento}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="text-blue-800">Teléfono *</label>
                  <input
                    name="persona.telefono"
                    required
                    value={form.persona.telefono}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Teléfono"
                  />
                </div>
                <div>
                  <label className="text-blue-800">Email *</label>
                  <input
                    name="persona.email"
                    type="email"
                    required
                    value={form.persona.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Correo electrónico"
                  />
                </div>
              </div>

              <div className="text-blue-700 font-semibold mt-6 mb-2">Datos médicos</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-800">Alergias</label>
                  <input
                    name="paciente.alergias"
                    value={form.paciente.alergias}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                    placeholder="Ninguna / Indique"
                  />
                </div>
              </div>

              {/* Alertas */}
              {mensaje && <ShowAlert type="success">{mensaje}</ShowAlert>}
              {error && <ShowAlert type="error">{error}</ShowAlert>}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/pacientes")}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-blue-700 hover:bg-blue-50 border border-blue-100 font-semibold transition"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-lg transition"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
