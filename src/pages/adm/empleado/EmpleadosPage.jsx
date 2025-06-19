// src/pages/Empleados/EmpleadosPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllEmpleados,
  deleteEmpleado,
} from '../../../services/empleado.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { Pencil, Trash2, RotateCcw, Briefcase, Loader2 } from 'lucide-react';

/* ------------------- Pequeño botón reutilizable ------------------- */
const IconButton = ({ className = '', children, ...props }) => (
  <button
    className={`p-2 rounded-lg transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

/* --------------------------- Fila tabla --------------------------- */
const Row = ({ emp, idx, onEdit, onDelete, onTurno, onServicios }) => {
  const p = emp.persona ?? {};
  return (
    <tr className="hover:bg-blue-50/60 transition">
      <td className="px-4 py-3 text-center font-semibold text-blue-500">
        {idx + 1}
      </td>
      <td className="px-4 py-3">{p.nombres || '—'}</td>
      <td className="px-4 py-3">{p.apellidoPaterno || '—'}</td>
      <td className="px-4 py-3">{p.apellidoMaterno || '—'}</td>
      <td className="px-4 py-3">{p.ci || '—'}</td>
      <td className="px-4 py-3">
        {p.fechaNacimiento ? new Date(p.fechaNacimiento).toLocaleDateString() : '—'}
      </td>
      <td className="px-4 py-3">{p.telefono || '—'}</td>
      <td className="px-4 py-3">{p.email || '—'}</td>
      <td className="px-4 py-3">
        {p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleDateString() : '—'}
      </td>
      <td className="px-4 py-3">{emp.cargo || '—'}</td>
      <td className="px-4 py-3">{emp.especialidad || '—'}</td>
      <td className="px-4 py-3 flex justify-center gap-2">
        <IconButton
          onClick={() => onEdit(emp.idEmpleado)}
          className="bg-blue-200 hover:bg-blue-400 text-blue-800 hover:text-white"
          title="Actualizar"
        >
          <Pencil size={18} />
        </IconButton>
        <IconButton
          onClick={() => onDelete(emp)}
          className="bg-red-200 hover:bg-red-400 text-red-800 hover:text-white"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </IconButton>
        <IconButton
          onClick={() => onTurno(emp.idEmpleado)}
          className="bg-sky-200 hover:bg-sky-400 text-sky-800 hover:text-white"
          title="Asignar turno"
        >
          <RotateCcw size={18} />
        </IconButton>
        <IconButton
          onClick={() => onServicios(emp.idEmpleado)}
          className="bg-indigo-200 hover:bg-indigo-400 text-indigo-800 hover:text-white"
          title="Ver servicios"
        >
          <Briefcase size={18} />
        </IconButton>
      </td>
    </tr>
  );
};

/* ------------------------ Página principal ------------------------ */
export const EmpleadosPage = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllEmpleados();
      setEmpleados(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const empleadosFiltrados = empleados.filter((emp) => {
    const p = emp.persona ?? {};
    const txt = `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno} ${p.ci} ${emp.cargo} ${emp.especialidad}`;
    return txt.toLowerCase().includes(filtro.toLowerCase());
  });

  /* ---------- handlers ---------- */
  const goEdit = (id) => navigate(`/empleados/editar/${id}`);
  const goTurno = (id) => navigate(`/asistencia/asignarTurno/${id}`);
  const goServicios = (id) => navigate(`/empleados/${id}/servicios`);

  const [delModal, setDelModal] = useState({ show: false, emp: null, loading: false });
  const openDel = (emp) => setDelModal({ show: true, emp, loading: false });

  const confirmDel = async () => {
    setDelModal((m) => ({ ...m, loading: true }));
    try {
      await deleteEmpleado(delModal.emp.idEmpleado);
      setDelModal({ show: false, emp: null, loading: false });
      fetchEmpleados();
    } catch {
      alert('Error al eliminar');
      setDelModal({ show: false, emp: null, loading: false });
    }
  };

  return (
    <AdminLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">
            Empleados
          </h1>
          <button
            onClick={() => navigate('/registrar-empleado')}
            className="inline-flex gap-2 items-center bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition"
          >
            ＋ Añadir empleado
          </button>
        </div>

        {/* Filtro */}
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar…"
          className="w-full sm:max-w-md mb-6 border border-blue-200 rounded-xl px-4 py-2 text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 shadow-sm"
        />

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-sm">
            {/* head */}
            <thead>
              <tr className="bg-blue-50 text-blue-900 font-bold">
                {[
                  '#',
                  'Nombres',
                  'Ap. P.',
                  'Ap. M.',
                  'CI',
                  'Nacimiento',
                  'Teléfono',
                  'Email',
                  'Registro',
                  'Cargo',
                  'Especialidad',
                  'Acciones',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-center ${
                      i === 0 ? 'rounded-tl-2xl' : ''
                    } ${h === 'Acciones' ? 'rounded-tr-2xl' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            {/* body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-6 text-center text-blue-600">
                    <Loader2 className="animate-spin inline-block mr-2" />
                    Cargando…
                  </td>
                </tr>
              ) : empleadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-6 text-center text-blue-600">
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((emp, idx) => (
                  <Row
                    key={emp.idEmpleado}
                    emp={emp}
                    idx={idx}
                    onEdit={goEdit}
                    onDelete={openDel}
                    onTurno={goTurno}
                    onServicios={goServicios}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal confirmación */}
      {delModal.show && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              ¿Eliminar empleado?
            </h2>
            <p className="text-blue-600 mb-6">
              Esta acción no se puede deshacer.
              <br />
              <b>
                {delModal.emp.persona?.nombres}{' '}
                {delModal.emp.persona?.apellidoPaterno}
              </b>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDelModal({ show: false, emp: null, loading: false })}
                className="px-5 py-2 rounded-xl font-bold bg-blue-100 text-blue-700 hover:bg-blue-200"
                disabled={delModal.loading}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDel}
                className="px-5 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-700"
                disabled={delModal.loading}
              >
                {delModal.loading ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
