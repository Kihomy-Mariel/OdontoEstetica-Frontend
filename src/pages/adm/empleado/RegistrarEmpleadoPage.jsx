import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmpleado } from "../../../services/empleado.service";
import { ShowAlert } from "../../../components/common/showAlerts/ShowAlert";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const initialForm = {
  username: "",
  password: "",
  confirmPassword: "",
  idRol: 1,
  persona: {
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
  },
  empleado: {
    cargo: "",
    especialidad: "",
  },
};

const ROLES = [
  { id: 1, label: "Odontólogo" },
  { id: 2, label: "Asistente" },
  { id: 4, label: "Auxiliar" },
  { id: 5, label: "Administrador" },
];

export const RegistrarEmpleadoPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("persona.")) {
      setForm((f) => ({
        ...f,
        persona: { ...f.persona, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("empleado.")) {
      setForm((f) => ({
        ...f,
        empleado: { ...f.empleado, [name.split(".")[1]]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMensaje("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const { confirmPassword, ...rest } = form;
    const payload = {
      username: form.username,
      password: form.password,
      habilitado: true,
      idRol: parseInt(form.idRol, 10),
      persona: {
        ...form.persona,
        fechaNacimiento: form.persona.fechaNacimiento, // Debe ser "YYYY-MM-DD"
        telefono: form.persona.telefono,
        email: form.persona.email,
      },
      empleado: {
        cargo: form.empleado.cargo,
        especialidad: form.empleado.especialidad,
      },
    };

    try {
      await registerEmpleado(payload);
      setMensaje("¡Empleado registrado correctamente!");
      setTimeout(() => navigate("/empleados"), 1500);
    } catch (err) {
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
              Registrar nuevo empleado
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario y contraseñas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-800 font-medium">Usuario *</label>
                <input
                  name="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300"
                  autoComplete="new-username"
                  placeholder="Nombre de usuario"
                />
              </div>
              <div>
                <label className="text-blue-800 font-medium">Contraseña *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 pr-12"
                    autoComplete="new-password"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-700 text-xl"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-blue-800 font-medium">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 pr-12"
                    autoComplete="new-password"
                    placeholder="Confirme su contraseña"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-700 text-xl"
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-blue-800 font-medium">Rol *</label>
                <select
                  name="idRol"
                  value={form.idRol}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300"
                  required
                >
                  {ROLES.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Datos personales */}
            <div className="text-blue-700 font-semibold mt-6 mb-2">
              Datos personales
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ... (inputs de persona igual que antes) ... */}
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

            {/* Datos de empleado */}
            <div className="text-blue-700 font-semibold mt-6 mb-2">
              Datos de empleado
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-800">Cargo *</label>
                <input
                  name="empleado.cargo"
                  required
                  value={form.empleado.cargo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                  placeholder="Ej: Odontopediatra, Asistente..."
                />
              </div>
              <div>
                <label className="text-blue-800">Especialidad *</label>
                <input
                  name="empleado.especialidad"
                  required
                  value={form.empleado.especialidad}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-300"
                  placeholder="Ej: Ortodoncia, Higienista..."
                />
              </div>
            </div>

            {/* Alertas */}
            {mensaje && <ShowAlert type="success">{mensaje}</ShowAlert>}
            {error && <ShowAlert type="error">{error}</ShowAlert>}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => navigate("/empleados")}
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
                {loading ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
