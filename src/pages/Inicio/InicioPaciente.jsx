import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllServicios } from "../../services/servicio.service";
import { getCitasByPaciente } from "../../services/cita.service";
import { User, Calendar, Clock } from "lucide-react";
import { PacienteLayout } from "../../components/layouts/PacienteLayout";

export const InicioPaciente = () => {
  const navigate = useNavigate();
  const usuario = useSelector((store) => store.usuario);
  const [servicios, setServicios] = useState([]);
  const [citasProximas, setCitasProximas] = useState([]);

  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setServicios(await getAllServicios());
        if (usuario?.idPersona) {
          const citas = await getCitasByPaciente(usuario.idPersona);
          const hoy = new Date().toISOString().split("T")[0];
          const futuras = citas
            .filter(cita => cita.fecha >= hoy)
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
          setCitasProximas(futuras.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [usuario]);

  return (
    <PacienteLayout>
      <div className="max-w-4xl mx-auto py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl mt-5 mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
          ¡Bienvenido, <span className="text-blue-400">{usuario.nombre || 'Paciente'}</span>!
        </h2>

        {/* Card de perfil */}
        <div className="bg-white rounded-2xl p-6 mb-10 shadow">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{nombreCompleto}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <ProfileField label="Rol" value={usuario.rol} />
            <ProfileField label="Usuario" value={usuario.username} />
            <ProfileField label="Correo" value={usuario.email} />
            <ProfileField label="CI" value={usuario.ci} />
            <ProfileField label="Teléfono" value={usuario.telefono} />
            <ProfileField label="Fecha de nacimiento" value={usuario.fechaNacimiento ? formatDate(usuario.fechaNacimiento) : "-"} />
          </div>
        </div>

        {/* Citas próximas */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <Calendar size={20} /> Próximas Citas
          </h3>
          {citasProximas.length > 0 ? (
            <div className="divide-y divide-blue-100">
              {citasProximas.map((cita, index) => (
                <div key={cita.idCita} className="py-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-800 font-medium">
                      {formatDate(cita.fecha)} a las {cita.hora}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-blue-300 italic text-center py-4">
              No tienes citas programadas próximamente.
            </p>
          )}
        </div>
      </div>
    </PacienteLayout>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <span className="block text-xs font-semibold text-blue-400 mb-1">{label}</span>
    <span className="text-sm font-medium text-blue-700">{value || "-"}</span>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
