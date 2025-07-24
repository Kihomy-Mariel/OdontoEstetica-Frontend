// src/pages/Pacientes/DoctoresPublicPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmpleados } from '../../../services/empleado.service';
import { Loader2, Briefcase } from 'lucide-react';
import { PacienteLayout } from '../../../components/layouts/PacienteLayout';

export const OdontologosPage = () => {
  const navigate = useNavigate();
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllEmpleados();
        const soloDoctores = data.filter(
          (emp) =>
            emp.cargo?.toLowerCase() === 'odontólogo' || emp.cargo?.toLowerCase() === 'doctor'
        );
        setDoctores(soloDoctores);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const doctoresFiltrados = doctores.filter((emp) => {
    const p = emp.persona ?? {};
    const texto = `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno} ${emp.cargo} ${emp.especialidad}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <PacienteLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-4">
          Nuestro equipo de doctores
        </h1>

        {/* Filtro */}
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar doctor por nombre o especialidad…"
          className="w-full sm:max-w-md mb-6 border border-blue-200 rounded-xl px-4 py-2 text-blue-900 placeholder-blue-400 shadow-sm focus:outline-none focus:border-blue-500"
        />

        {loading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="animate-spin" />
            Cargando doctores…
          </div>
        ) : doctoresFiltrados.length === 0 ? (
          <p className="text-blue-600">No se encontraron doctores.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctoresFiltrados.map((emp) => {
              const p = emp.persona ?? {};
              return (
                <article
                  key={emp.idEmpleado}
                  className="bg-white border border-blue-100 rounded-2xl shadow p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <h2 className="text-xl font-bold text-blue-800 mb-1">
                      Dr. {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
                    </h2>
                    <p className="text-blue-600 text-sm mb-1">
                      Especialidad: <b>{emp.especialidad || 'General'}</b>
                    </p>
                    <p className="text-blue-600 text-sm">
                      Email: {p.email || '—'} <br />
                      Teléfono: {p.telefono || '—'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        navigate(`/pacientes/doctores-servicios/${emp.idEmpleado}`)
                      }
                      className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 font-semibold px-4 py-2 rounded-xl shadow-md transition"
                    >
                      <Briefcase size={18} /> Ver servicios que realiza
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PacienteLayout>
  );
};
