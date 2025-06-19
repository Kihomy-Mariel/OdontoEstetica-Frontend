// src/pages/Empleados/EmpleadoServicioPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServiciosByEmpleado } from '../../../services/realiza.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { Loader2, ArrowLeft } from 'lucide-react';

export const EmpleadoServicioPage = () => {
    const { idEmpleado } = useParams();
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getServiciosByEmpleado(idEmpleado);
                setServicios(data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [idEmpleado]);

    return (
        <AdminLayout>
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        aria-label="Volver"
                    >
                        <ArrowLeft />
                    </button>
                    <h1 className="text-3xl font-extrabold text-blue-800">
                        Servicios realizados
                    </h1>
                </header>
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => navigate(`/empleados/${idEmpleado}/registrar-servicio`)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition"
                    >
                        ＋ Registrar nuevo servicio
                    </button>
                </div>


                {/* Contenido */}
                {loading ? (
                    <p className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="animate-spin" size={20} /> Cargando...
                    </p>
                ) : servicios.length === 0 ? (
                    <p className="text-blue-600">
                        Este odontólogo aún no tiene servicios registrados.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {servicios.map((srv) => (
                            <article
                                key={srv.idServicio}
                                className="border border-blue-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col"
                            >
                                <h3 className="font-bold text-blue-800 mb-1">
                                    {srv.servicio?.nombreServicio ?? 'Servicio sin nombre'}
                                </h3>
                                <p className="text-blue-600 text-sm flex-1">
                                    Observaciones: {srv.observaciones || '—'}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </AdminLayout>
    );
};
