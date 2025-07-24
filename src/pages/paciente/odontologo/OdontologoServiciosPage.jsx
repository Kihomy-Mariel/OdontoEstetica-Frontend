// src/pages/Pacientes/OdontologoServiciosPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiciosByEmpleado } from '../../../services/realiza.service';
import { PacienteLayout } from '../../../components/layouts/PacienteLayout';
import { Loader2, ArrowLeft, Info } from 'lucide-react';

export const OdontologoServiciosPage = () => {
  const { idEmpleado } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServicios = async () => {
    try {
      const data = await getServiciosByEmpleado(idEmpleado);
      setServicios(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, [idEmpleado]);

  const doctor = servicios[0]?.empleado?.persona ?? {};
  const cargo = servicios[0]?.empleado?.cargo?.toLowerCase();
  const nombreCompleto = `${cargo === 'odontólogo' ? 'Dr/a. ' : ''}${doctor.nombres ?? ''} ${doctor.apellidoPaterno ?? ''} ${doctor.apellidoMaterno ?? ''}`;

  return (
    <PacienteLayout>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            aria-label="Volver"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 leading-snug">
              Servicios que realiza {nombreCompleto}
            </h1>
            <p className="text-sm text-blue-500">
              Conozca los tratamientos y procedimientos disponibles.
            </p>
          </div>
        </header>

        {/* Contenido */}
        {loading ? (
          <p className="flex items-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" size={20} /> Cargando servicios…
          </p>
        ) : servicios.length === 0 ? (
          <p className="text-blue-600">Este doctor aún no tiene servicios registrados.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((srv) => (
              <article
                key={srv.idServicio}
                className="border border-blue-100 rounded-2xl p-5 bg-white shadow hover:shadow-md transition flex flex-col"
              >
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                  {srv.servicio?.nombreServicio ?? 'Servicio sin nombre'}
                </h3>
                <p className="text-blue-600 text-sm">
                  <span className="font-medium">Observaciones:</span><br />
                  {srv.observaciones || '—'}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PacienteLayout>
  );
};
