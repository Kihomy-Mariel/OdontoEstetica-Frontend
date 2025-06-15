// src/pages/Empleados/EmpleadosPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmpleados, deleteEmpleado } from "../../../services/empleado.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { Pencil, Trash2, RotateCcw } from "lucide-react"; // Actualizar, Eliminar, AsignarTurno

export const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEmpleados();
      setEmpleados(data);
    };
    fetchData();
  }, []);

  const empleadosFiltrados = empleados.filter((emp) => {
    const persona = emp.persona || {};
    const texto = `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno} ${persona.ci} ${persona.fechaNacimiento} ${persona.telefono} ${persona.email} ${persona.fechaRegistro} ${emp.cargo} ${emp.especialidad}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  // Acciones
  const handleUpdate = (idEmpleado) => navigate(`/empleados/editar/${idEmpleado}`);
  const handleDeleteClick = (emp) => {
    setEmpleadoAEliminar(emp);
    setShowModal(true);
  };

    // Confirmación de borrado
  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteEmpleado(empleadoAEliminar.idEmpleado);
      setShowModal(false);
      setEmpleadoAEliminar(null);
      fetchData();
    } catch (err) {
      alert("Error al eliminar empleado.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleAsignarTurno = (id) => navigate(`/asistencia/asignarTurno/${id}`);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-2 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight mb-2 sm:mb-0 drop-shadow">
            Empleados Registrados
          </h2>
          <button
            onClick={() => navigate("/registrar-empleado")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md text-base transition"
          >
            <span className="text-lg font-bold">＋</span> Añadir empleado
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, CI, cargo, especialidad..."
            className="flex-1 border border-blue-200 rounded-xl px-4 py-2 text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 shadow-sm transition"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm sm:text-base">
            <thead>
              <tr className="bg-blue-50 text-blue-900 font-bold">
                <th className="px-4 py-3 rounded-tl-2xl text-center">#</th>
                <th className="px-4 py-3">Nombres</th>
                <th className="px-4 py-3">Apellido Paterno</th>
                <th className="px-4 py-3">Apellido Materno</th>
                <th className="px-4 py-3">CI</th>
                <th className="px-4 py-3">Fecha Nacimiento</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Fecha Registro</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3 rounded-tr-2xl text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-6 text-blue-500">
                    No hay empleados registrados.
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((emp, idx) => (
                  <tr
                    key={emp.idEmpleado}
                    className="hover:bg-blue-50/80 transition"
                  >
                    <td className="px-4 py-3 text-center text-blue-500 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3">{emp.persona?.nombres || "-"}</td>
                    <td className="px-4 py-3">{emp.persona?.apellidoPaterno || "-"}</td>
                    <td className="px-4 py-3">{emp.persona?.apellidoMaterno || "-"}</td>
                    <td className="px-4 py-3">{emp.persona?.ci || "-"}</td>
                    <td className="px-4 py-3">
                      {emp.persona?.fechaNacimiento
                        ? new Date(emp.persona.fechaNacimiento).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">{emp.persona?.telefono || "-"}</td>
                    <td className="px-4 py-3">{emp.persona?.email || "-"}</td>
                    <td className="px-4 py-3">
                      {emp.persona?.fechaRegistro
                        ? new Date(emp.persona.fechaRegistro).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">{emp.cargo || "-"}</td>
                    <td className="px-4 py-3">{emp.especialidad || "-"}</td>
                    <td className="px-4 py-3 flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleUpdate(emp.idEmpleado)}
                        className="p-2 rounded-lg bg-blue-200 hover:bg-blue-400 text-blue-800 hover:text-white transition"
                        title="Actualizar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                         onClick={() => handleDeleteClick(emp)}
                        className="p-2 rounded-lg bg-red-200 hover:bg-red-400 text-red-800 hover:text-white transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleAsignarTurno(emp.idEmpleado)}
                        className="p-2 rounded-lg bg-sky-200 hover:bg-sky-400 text-sky-800 hover:text-white transition"
                        title="Asignar Turno"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

            {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed z-40 inset-0 bg-black bg-opacity-30 flex items-center justify-center transition">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-blue-100 animate-fade-in-up">
              <h2 className="text-xl font-bold text-blue-800 mb-4">¿Eliminar empleado?</h2>
              <p className="text-blue-600 mb-4">
                ¿Está seguro de que desea eliminar al empleado <b>
                {empleadoAEliminar?.persona?.nombres} {empleadoAEliminar?.persona?.apellidoPaterno}</b>?
                <br />
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  disabled={loadingDelete}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-700 transition"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
