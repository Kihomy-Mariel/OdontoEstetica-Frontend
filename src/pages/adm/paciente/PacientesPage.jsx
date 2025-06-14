import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPacientes } from "../../../services/paciente.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { FileText, Eye, UserPlus } from "lucide-react";

export const PacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPacientes();
      setPacientes(data);
    };
    fetchData();
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const persona = p.persona || {};
    const texto = `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno} ${persona.ci} ${persona.telefono} ${persona.email} ${persona.fechaNacimiento} ${persona.fechaRegistro}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-blue-700 text-center sm:text-left">Pacientes Registrados</h2>
          <button
            onClick={() => navigate("/registrar-pacientes")}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          >
            <UserPlus size={20} />
            Añadir Paciente
          </button>
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre, CI, correo, etc..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base shadow-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="min-w-[950px] w-full text-sm text-left">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-3 font-semibold">Nombres</th>
                <th className="px-4 py-3 font-semibold">Ap. Paterno</th>
                <th className="px-4 py-3 font-semibold">Ap. Materno</th>
                <th className="px-4 py-3 font-semibold">CI</th>
                <th className="px-4 py-3 font-semibold">Fecha Nac.</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Registro</th>
                <th className="px-4 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map(p => (
                <tr key={p.idPaciente} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{p.persona?.nombres}</td>
                  <td className="px-4 py-2">{p.persona?.apellidoPaterno}</td>
                  <td className="px-4 py-2">{p.persona?.apellidoMaterno}</td>
                  <td className="px-4 py-2">{p.persona?.ci}</td>
                  <td className="px-4 py-2">{p.persona?.fechaNacimiento}</td>
                  <td className="px-4 py-2">{p.persona?.telefono}</td>
                  <td className="px-4 py-2">{p.persona?.email}</td>
                  <td className="px-4 py-2">{p.persona?.fechaRegistro?.slice(0, 10)}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        title="Registrar historial clínico"
                        onClick={() => navigate(`/pacientes/${p.idPaciente}/historial/nuevo`)}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                      >
                        <FileText size={20} />
                      </button>
                      <button
                        title="Ver historiales clínicos"
                        onClick={() => navigate(`/pacientes/${p.idPaciente}/historial`)}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pacientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No se encontraron pacientes con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
