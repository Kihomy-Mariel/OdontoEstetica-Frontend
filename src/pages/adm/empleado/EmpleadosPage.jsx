import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmpleados } from "../../../services/empleado.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import "./EmpleadosPage.css";

export const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEmpleados();
      setEmpleados(data);
    };
    fetchData();
  }, []);

  const empleadosFiltrados = empleados.filter(emp => {
    const persona = emp.persona || {};
    const texto = `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno} ${persona.ci} ${persona.fechaNacimiento} ${persona.telefono} ${persona.email} ${persona.fechaRegistro} ${emp.cargo} ${emp.especialidad}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="empleados-container">
        <h2 className="title">Empleados Registrados</h2>

        <input
          type="text"
          placeholder="Buscar por nombre, CI, cargo, etc..."
          className="filtro-input"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="tabla-scroll">
          <table className="empleados-table">
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
                <th>Cargo</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map(emp => (
                <tr key={emp.idEmpleado}>
                  <td>{emp.persona?.nombres}</td>
                  <td>{emp.persona?.apellidoPaterno}</td>
                  <td>{emp.persona?.apellidoMaterno}</td>
                  <td>{emp.persona?.ci}</td>
                  <td>{emp.persona?.fechaNacimiento}</td>
                  <td>{emp.persona?.telefono}</td>
                  <td>{emp.persona?.email}</td>
                  <td>{emp.persona?.fechaRegistro?.slice(0, 10)}</td>
                  <td>{emp.cargo}</td>
                  <td>{emp.especialidad}</td>
                  <td>
                    <button
                      className="btn-asignar"
                      onClick={() => navigate(`/asistencia/asignarTurno/${emp.idEmpleado}`)}
                    >
                      Asignar Turno
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