import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../services/empleado.service";
import { getAllPacientes } from "../../services/paciente.service";
import { getAllServicios } from "../../services/servicio.service";
import { getPersonaById } from "../../services/persona.service";
import { LayoutDashboard, Users, User, Calendar } from "lucide-react";
import { AdminLayout } from "../../components/layouts/AdminLayout";

export const InicioAdm = () => {
    const usuario = useSelector((store) => store.usuario);
    const [empleados, setEmpleados] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [persona, setPersona] = useState({});

    const navigate = useNavigate();
    console.log("usuario desde redux:", usuario);
    console.log("usuario.idPersona:", usuario.idPersona);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setEmpleados(await getAllEmpleados());
                setPacientes(await getAllPacientes());
                setServicios(await getAllServicios());
                if (usuario?.idPersona) {
                    const personaData = await getPersonaById(usuario.idPersona);
                    console.log("personaData:", personaData);
                    setPersona(personaData);
                }
            } catch (err) {
                // manejar errores
            }
        };
        fetchData();
    }, [usuario]);

    const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto py-8 px-3 md:px-7 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl mt-5 mb-10 animate-fade-in-up">
                <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight text-center drop-shadow">
                    Bienvenido, <span className="text-blue-400">Administrador</span>
                </h2>

                {/* Card de perfil mejorada */}
                <div className="bg-blue-50 rounded-2xl p-6 md:p-9 mb-10 flex flex-col sm:flex-row items-center gap-7 shadow">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center sm:text-left">{nombreCompleto}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
                            <ProfileField label="Rol" value={usuario.rol} />
                            <ProfileField label="Usuario" value={usuario.username} />
                            <ProfileField label="Correo" value={usuario.email} />
                            <ProfileField label="CI" value={usuario.ci}/>
                            <ProfileField label="Teléfono" value={usuario.telefono}/>
                            <ProfileField label="Fecha de nacimiento" value={usuario.fechaNacimiento ? usuario.fechaNacimiento.substring(0, 10) : "-"}/>
                            <ProfileField label="Fecha de registro" value={usuario.fechaRegistro ? usuario.fechaRegistro.substring(0, 10) : "-"}/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <StatBox title="Citas Hoy" value="12" icon={<Calendar size={24} />} onClick={() => navigate("/citas")} />
                    <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={24} />} onClick={() => navigate("/pacientes")} />
                    <StatBox title="Servicios" value={servicios.length} icon={<LayoutDashboard size={24} />} onClick={() => navigate("/servicios")} />
                    <StatBox title="Empleados Activos" value={empleados.length} icon={<Users size={24} />} onClick={() => navigate("/empleados")} />

                </div>



                <div className="bg-white rounded-xl p-7 shadow-md">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Citas del Día</h3>
                    <p className="text-blue-400 text-base italic">
                        (Listado de citas aquí...)
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

// Componente para mostrar cada campo de perfil
const ProfileField = ({ label, value }) => (
    <div className="flex flex-col mb-1">
        <span className="text-xs font-semibold text-blue-400">{label}</span>
        <span className="text-sm font-medium text-blue-900">{value}</span>
    </div>
);

// StatBox solo tailwind, UX moderno
const StatBox = ({ title, value, icon, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.025] transition-all duration-200 px-7 py-8 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
        <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-blue-800 text-lg">{title}</span>
            <span className="text-blue-400">{icon}</span>
        </div>
        <div className="text-4xl font-extrabold text-blue-500 drop-shadow">{value}</div>
    </button>
);

// Formateador de fecha bonito
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-BO", { year: 'numeric', month: 'long', day: 'numeric' });
};
