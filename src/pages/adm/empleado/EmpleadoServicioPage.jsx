// src/pages/Empleados/EmpleadoServicioPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getServiciosByEmpleado,
    updateRealiza,
    deleteRealiza,
} from '../../../services/realiza.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { Loader2, ArrowLeft, Pencil, Trash2, Save, X } from 'lucide-react';

export const EmpleadoServicioPage = () => {
    const { idEmpleado } = useParams();
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [observacionesEdit, setObservacionesEdit] = useState('');

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

    const handleEdit = (id, observaciones, descripcionServicio) => {
        const texto = observaciones?.trim()
            ? observaciones
            : (descripcionServicio ?? '');
        setEditId(id);
        setObservacionesEdit(texto);
    };


    const handleCancel = () => {
        setEditId(null);
        setObservacionesEdit('');
    };

    const handleSave = async (idServicio) => {
        try {
            const payload = {
                idEmpleado: Number(idEmpleado),
                idServicio: Number(idServicio),
                observaciones: observacionesEdit.trim(),
            };

            console.log('Enviando actualización:', payload);

            await updateRealiza(payload);
            await fetchServicios();
            setEditId(null);
            setObservacionesEdit('');

            // Opcional: Mostrar mensaje de éxito
            alert('Observaciones actualizadas correctamente');
        } catch (error) {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar las observaciones');
        }
    };

    const handleDelete = async (idServicio) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio que realiza el doctor?')) {
            return;
        }

        try {
            const payload = {
                idEmpleado: Number(idEmpleado),
                idServicio: Number(idServicio),
            };

            console.log('Enviando eliminación:', payload);

            await deleteRealiza(payload);
            await fetchServicios();

            // Opcional: Mostrar mensaje de éxito
            alert('Servicio eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al desactivar el servicio');
        }
    };

    return (
        <AdminLayout>
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(`/empleados`)}
                        className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        aria-label="Volver"
                    >
                        <ArrowLeft />
                    </button>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 leading-snug">
                            {servicios.length > 0 ? (
                                <>
                                    Servicios que realiza {" "}
                                    <span className="text-blue-600">
                                        {servicios[0]?.empleado?.cargo?.toLowerCase() === "odontólogo"
                                            ? `Dr. `
                                            : ""}
                                        {`${servicios[0]?.empleado?.persona?.nombres ?? ""} ${servicios[0]?.empleado?.persona?.apellidoPaterno ?? ""} ${servicios[0]?.empleado?.persona?.apellidoMaterno ?? ""}`}
                                    </span>
                                </>
                            ) : (
                                "Servicios realizados"
                            )}
                        </h1>
                        <p className="text-sm text-blue-500">
                            Visualice los servicios asignados.
                        </p>
                    </div>
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
                        Aún no tiene servicios registrados.
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
                                {editId === srv.idServicio ? (
                                    <textarea
                                        value={observacionesEdit}
                                        onChange={(e) => setObservacionesEdit(e.target.value)}
                                        className="border border-blue-200 rounded-xl p-2 text-blue-800 resize-none mb-2"
                                    />
                                ) : (
                                    <p className="text-blue-600 text-sm flex-1">
                                        Observaciones: {srv.observaciones || '—'}
                                    </p>
                                )}

                                <div className="flex gap-2 mt-4">
                                    {editId === srv.idServicio ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(srv.idServicio)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <Save size={18} />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleEdit(srv.idServicio, srv.observaciones, srv.servicio?.descripcion)
                                            }
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    )}


                                    <button
                                        onClick={() => handleDelete(srv.idServicio)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </AdminLayout>
    );
};
