import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPacientes } from "../../../services/paciente.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { FileText, Eye } from "lucide-react";
import "./PacientesPage.css";

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
      <div className="pacientes-container">
        <h2 className="title">Pacientes Registrados</h2>

        <input
          type="text"
          placeholder="Buscar por nombre, CI, correo, etc..."
          className="filtro-input"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="tabla-scroll">
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Ap. Paterno</th>
                <th>Ap. Materno</th>
                <th>CI</th>
                <th>Fecha Nac.</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map(p => (
                <tr key={p.idPaciente}>
                  <td>{p.persona?.nombres}</td>
                  <td>{p.persona?.apellidoPaterno}</td>
                  <td>{p.persona?.apellidoMaterno}</td>
                  <td>{p.persona?.ci}</td>
                  <td>{p.persona?.fechaNacimiento}</td>
                  <td>{p.persona?.telefono}</td>
                  <td>{p.persona?.email}</td>
                  <td>{p.persona?.fechaRegistro?.slice(0, 10)}</td>
                  <td className="acciones-cell">
                    {/* Registrar historial clínico */}
                    <button
                      className="btn-hc"
                      title="Registrar historial clínico"
                      onClick={() => navigate(`/pacientes/${p.idPaciente}/historial/nuevo`)}
                    >
                      <FileText size={20} />
                    </button>
                    {/* Ver listado de historiales clínicos */}
                    <button
                      className="btn-view"
                      title="Ver historiales clínicos"
                      onClick={() => navigate(`/pacientes/${p.idPaciente}/historial`)}
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
