import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPacientes, deletePaciente } from "../../../services/paciente.service";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { FileText, Eye, UserPlus, Pencil, Trash2 } from "lucide-react";

export const PacientesPageAsist = () => {
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

  // Añade el numeral al filtro (idx+1)
  const pacientesFiltrados = pacientes.filter((p, idx) => {
    const persona = p.persona || {};
    const numeral = (idx + 1).toString();
     const texto = `
    ${numeral} 
    ${persona.nombres} 
    ${persona.apellidoPaterno} 
    ${persona.apellidoMaterno} 
    ${persona.ci} 
    ${persona.telefono} 
    ${persona.email} 
    ${persona.fechaNacimiento} 
    ${persona.fechaRegistro} 
    ${p.alergias || ""}
  `;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  const handleDelete = async (idPaciente) => {
    if (window.confirm("¿Está seguro que desea eliminar este paciente?")) {
      await deletePaciente(idPaciente);
      setPacientes(prev => prev.filter(p => p.idPaciente !== idPaciente));
    }
  };

  return (
    <AsistLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-blue-700 text-center sm:text-left">Pacientes Registrados</h2>
          <button
            onClick={() => navigate("/registrar-pacientes-asist")}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          >
            <UserPlus size={20} />
            Añadir Paciente
          </button>
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre, CI, correo, alergias, etc..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base shadow-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="min-w-full w-full text-sm text-left">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-3 font-semibold text-center min-w-[40px]">#</th>
                <th className="px-4 py-3 font-semibold text-center min-w-[120px]">Acciones</th>
                <th className="px-4 py-3 font-semibold min-w-[140px] whitespace-normal break-words">Nombres</th>
                <th className="px-4 py-3 font-semibold min-w-[140px] whitespace-normal break-words">Apellido Paterno</th>
                <th className="px-4 py-3 font-semibold min-w-[140px] whitespace-normal break-words">Apellido Materno</th>
                <th className="px-4 py-3 font-semibold min-w-[100px]">Carnet de Identidad</th>
                <th className="px-4 py-3 font-semibold min-w-[120px]">Fecha de Nacimiento</th>
                <th className="px-4 py-3 font-semibold min-w-[110px]">Teléfono</th>
                <th className="px-4 py-3 font-semibold min-w-[180px] whitespace-normal break-words">Correo Electrónico</th>
                <th className="px-4 py-3 font-semibold min-w-[160px] whitespace-normal break-words">Fecha de Registro</th>
                <th className="px-4 py-3 font-semibold min-w-[140px] whitespace-normal break-words">Alergias</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map((p, idx) => (
                <tr key={p.idPaciente} className="hover:bg-blue-50 transition">
                 <td className="px-4 py-3 text-center text-blue-500 font-semibold">{idx + 1}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                     
                      <button
                        title="Editar paciente"
                        onClick={() => navigate(`/pacientes/${p.idPaciente}/editar/asist`)}
                        className="p-2 rounded-lg bg-blue-200 hover:bg-blue-400 text-blue-800 hover:text-white transition"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        title="Eliminar paciente"
                        onClick={() => handleDelete(p.idPaciente)}
                        className="p-2 rounded-lg bg-red-200 hover:bg-red-400 text-red-800 hover:text-white transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.nombres}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.apellidoPaterno}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.apellidoMaterno}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.ci}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.fechaNacimiento}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.telefono}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.email}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.persona?.fechaRegistro?.slice(0, 10)}</td>
                  <td className="px-4 py-2 whitespace-normal break-words">{p.alergias || "—"}</td>
                </tr>
              ))}
              {pacientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-500">
                    No se encontraron pacientes con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AsistLayout>
  );
};
