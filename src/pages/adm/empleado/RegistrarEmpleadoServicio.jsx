// src/pages/Empleados/RegistrarEmpleadoServicioPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneEmpleado } from '../../../services/empleado.service';
import { getAllServicios } from '../../../services/servicio.service';
import { createRealiza } from '../../../services/realiza.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { Loader2, ArrowLeft } from 'lucide-react';

export const RegistrarEmpleadoServicioPage = () => {
  const { idEmpleado } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({ idServicio: '', observaciones: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* ------------------- cargar datos iniciales ------------------- */
  useEffect(() => {
    const fetch = async () => {
      try {
        const [emp, servs] = await Promise.all([
          getOneEmpleado(idEmpleado),
          getAllServicios(),
        ]);
        setEmpleado(emp);
        setServicios(servs);
      } catch (e) {
        setError('Error cargando datos');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [idEmpleado]);

  /* --------------------------- métodos --------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.idServicio) {
      setError('Selecciona un servicio.');
      return;
    }
    try {
      setSaving(true);
      await createRealiza({
        idEmpleado: Number(idEmpleado),
        idServicio: Number(form.idServicio),
        observaciones: form.observaciones.trim(),
      });
      navigate(`/empleados/${idEmpleado}/servicios`);

    } catch {
      setError('No se pudo registrar el servicio.');
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------- render --------------------------- */
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 text-blue-600 p-8">
          <Loader2 className="animate-spin" /> Cargando...
        </div>
      </AdminLayout>
    );
  }

  if (!empleado) {
    return (
      <AdminLayout>
        <p className="text-red-500 p-8">Empleado no encontrado.</p>
      </AdminLayout>
    );
  }

  const p = empleado.persona ?? {};
  const nombreCompleto = `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`;

  return (
    <AdminLayout>
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-extrabold text-blue-800">
            Registrar servicio
          </h1>
        </header>

        {/* Card formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-blue-100 rounded-2xl shadow p-6 space-y-6"
        >
          {/* Empleado */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Odontólogo
            </label>
            <input
              type="text"
              value={nombreCompleto}
              disabled
              className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-900 cursor-not-allowed"
            />
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Servicio <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-blue-200 rounded-xl px-4 py-2 text-blue-900 focus:outline-none focus:border-blue-500"
              value={form.idServicio}
              onChange={(e) => {
                const selectedId = e.target.value;
                const servicioSeleccionado = servicios.find(
                  (s) => String(s.idServicio) === selectedId
                );

                setForm((f) => ({
                  ...f,
                  idServicio: selectedId,
                  observaciones: f.observaciones.trim()
                    ? f.observaciones // ya escribió algo → no lo cambiamos
                    : servicioSeleccionado?.descripcion ?? '', // si está vacío, usar descripción
                }));
              }}

              required
            >
              <option value="">— Selecciona un servicio —</option>
              {servicios.map((s) => (
                <option key={s.idServicio} value={s.idServicio}>
                  {s.nombreServicio}
                </option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Observaciones (opcional)
            </label>
            <textarea
              rows={3}
              className="w-full border border-blue-200 rounded-xl px-4 py-2 text-blue-900 resize-none focus:outline-none focus:border-blue-500"
              value={form.observaciones}
              onChange={(e) =>
                setForm((f) => ({ ...f, observaciones: e.target.value }))
              }
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-xl font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 shadow-md transition"
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
};
