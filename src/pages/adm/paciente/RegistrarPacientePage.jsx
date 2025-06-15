import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPaciente } from "../../../services/paciente.service";
import { registerCompletoUsuario } from "../../../services/auth.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { UserPlus } from "lucide-react";
import { ShowAlert } from "../../../components/common/showAlerts/ShowAlert";

const initialForm = {
    username: "",
    password: "",
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
    }
};

export const RegistrarPacientePage = () => {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Manejo para campos anidados
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
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMensaje("");

        try {
            // idRol: 3 para paciente, habilitado: true
            await registerCompletoUsuario({
                ...form,
                habilitado: true,
            });
            setMensaje("¡Paciente registrado correctamente!");
            setForm(initialForm);
            setTimeout(() => navigate("/pacientes"), 1800);
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
                            Registrar nuevo paciente
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300"
                                    autoComplete="new-password" 
                                    placeholder="Contraseña"
                                />
                            </div>
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

                        {/* AQUI VAN TUS ALERTAS */}
                        {mensaje && (
                            <ShowAlert type="success">{mensaje}</ShowAlert>
                        )}
                        {error && (
                            <ShowAlert type="error">{error}</ShowAlert>
                        )}

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
                                {loading ? "Registrando..." : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};
