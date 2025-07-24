import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../services/empleado.service";
import { getAllPacientes } from "../../services/paciente.service";
import { getAllServicios } from "../../services/servicio.service";
import { getCitas } from "../../services/cita.service";
import { LayoutDashboard, Users, User, Calendar, Clock } from "lucide-react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import ProfileField from "../../components/ui/ProfileField";
import StatBox from "../../components/ui/StatBox";

const getNombreCompleto = (usuario) =>
  `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

export const InicioAdm = () => {
  const usuario = useSelector((store) => store.usuario);
  const [empleados, setEmpleados] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);

  const navigate = useNavigate();

  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empleadosData, pacientesData, serviciosData, citasData] = await Promise.all([
          getAllEmpleados(),
          getAllPacientes(),
          getAllServicios(),
          getCitas()
        ]);

        setEmpleados(empleadosData);
        setPacientes(pacientesData);
        setServicios(serviciosData);
        setCitas(citasData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, [usuario]);

  const citasDeHoy = citas.filter(c => c.fecha === hoy);
  const nombreCompleto = getNombreCompleto(usuario);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 px-3 md:px-7 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl mt-5 mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight text-center drop-shadow">
          Bienvenido, <span className="text-blue-400">Administrador</span>
        </h2>

        {/* Card de perfil */}
        <div className="bg-blue-50 rounded-2xl p-6 md:p-9 mb-10 flex flex-col sm:flex-row items-center gap-7 shadow">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center sm:text-left">
              {nombreCompleto}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatBox title="Citas Hoy" value={citasDeHoy.length} icon={<Calendar size={24} />} onClick={() => navigate("/citas")} />
          <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={24} />} onClick={() => navigate("/pacientes")} />
          <StatBox title="Servicios" value={servicios.length} icon={<LayoutDashboard size={24} />} onClick={() => navigate("/servicios")} />
          <StatBox title="Empleados Activos" value={empleados.length} icon={<Users size={24} />} onClick={() => navigate("/empleados")} />
        </div>

        {/* Sección de Citas del Día */}
        <div className="bg-white rounded-xl p-7 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <Calendar size={20} /> Citas del Día
          </h3>

          {citasDeHoy.length === 0 ? (
            <p className="text-blue-500 italic">No hay citas programadas para hoy.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-blue-100 text-blue-700">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Paciente</th>
                    <th className="px-4 py-2 text-left">Hora</th>
                    <th className="px-4 py-2 text-left">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {citasDeHoy.map((cita, idx) => (
                    <tr key={cita.idCita} className="border-t hover:bg-blue-50">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2 text-blue-800 font-medium">
                        {cita.paciente?.persona?.nombres} {cita.paciente?.persona?.apellidoPaterno}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-1 text-blue-600">
                        <Clock size={16} /> {cita.hora}
                      </td>
                      <td className="px-4 py-2">{cita.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
