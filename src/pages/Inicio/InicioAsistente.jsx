// src/pages/Inicio/InicioAsistente.jsx
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPacientes } from "../../services/paciente.service";
import { getAllServicios } from "../../services/servicio.service";
import { getCitas } from "../../services/cita.service";
import { Calendar, User, Smile } from "lucide-react";
import { AsistLayout } from "../../components/layouts/AsistLayout";

export const InicioAsistente = () => {
  const usuario = useSelector((store) => store.usuario);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);

  const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPacientes(await getAllPacientes());
        setServicios(await getAllServicios());
        setCitas(await getCitas());
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <AsistLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 bg-white mt-5 mb-10 rounded-3xl shadow-lg animate-fade-in-up">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-7">
          Bienvenido, <span className="text-blue-400">Asistente</span>
        </h2>
        <h3 className="text-xl font-semibold text-blue-600 text-center mb-5">{nombreCompleto}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Citas Registradas" value={citas.length} icon={<Calendar size={24} />} />
          <StatCard title="Pacientes" value={pacientes.length} icon={<User size={24} />} />
          <StatCard title="Servicios" value={servicios.length} icon={<Smile size={24} />} />
        </div>

        <div className="bg-blue-50 p-5 rounded-xl shadow-sm">
          <h4 className="text-lg font-bold text-blue-700 mb-2">Acciones rápidas</h4>
          <p className="text-blue-500 italic">(Aquí puedes agregar enlaces a reservas, atención al paciente, etc.)</p>
        </div>
      </div>
    </AsistLayout>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-md px-5 py-6 flex flex-col items-center gap-2 hover:shadow-lg transition">
    <div className="text-blue-500">{icon}</div>
    <h4 className="text-xl font-bold text-blue-800">{value}</h4>
    <p className="text-sm text-blue-500">{title}</p>
  </div>
);
