// src/pages/Odontologo/InicioOdontologo.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPacientes } from "../../services/paciente.service";
import { getAllServicios } from "../../services/servicio.service";
import { OdontoLayout } from "../../components/layouts/OdontoLayout";
import { LayoutDashboard, User, Calendar } from "lucide-react";

export const InicioOdontologo = () => {
  const usuario = useSelector((store) => store.usuario);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPacientes(await getAllPacientes());
        setServicios(await getAllServicios());
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

  return (
    <OdontoLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl mt-5 mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center drop-shadow">
          Bienvenido, <span className="text-blue-400">Odontólogo</span>
        </h2>

        {/* Card de perfil */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-10 shadow flex flex-col md:flex-row items-center gap-7">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-blue-800 mb-3 text-center md:text-left">{nombreCompleto}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <ProfileField label="Rol" value={usuario.rol} />
              <ProfileField label="Usuario" value={usuario.username} />
              <ProfileField label="Correo" value={usuario.email} />
              <ProfileField label="CI" value={usuario.ci} />
              <ProfileField label="Teléfono" value={usuario.telefono} />
              <ProfileField label="Fecha de nacimiento" value={usuario.fechaNacimiento?.substring(0, 10) || "-"} />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatBox title="Citas de Hoy" value="7" icon={<Calendar size={24} />} onClick={() => navigate("/turnos")} />
          <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={24} />} onClick={() => navigate("/pacientes")} />
          <StatBox title="Servicios Ofrecidos" value={servicios.length} icon={<LayoutDashboard size={24} />} onClick={() => navigate("/servicios")} />
        </div>

        {/* Citas del día (espacio para futuro listado) */}
        <div className="bg-white rounded-xl p-7 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-2">Citas del Día</h3>
          <p className="text-blue-400 text-base italic">(Aquí aparecerán las citas programadas del día)</p>
        </div>
      </div>
    </OdontoLayout>
  );
};

// Componentes auxiliares
const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-blue-400">{label}</span>
    <span className="text-sm font-medium text-blue-900">{value}</span>
  </div>
);

const StatBox = ({ title, value, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-[1.025] transition-all px-6 py-6 flex flex-col items-center gap-2 cursor-pointer focus:ring-2 focus:ring-blue-400"
  >
    <div className="flex items-center gap-3 mb-1">
      <span className="font-semibold text-blue-800 text-lg">{title}</span>
      <span className="text-blue-400">{icon}</span>
    </div>
    <div className="text-4xl font-extrabold text-blue-500 drop-shadow">{value}</div>
  </button>
);
