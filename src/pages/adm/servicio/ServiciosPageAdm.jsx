import React, { useEffect, useState } from "react";
import { getAllServicios, deleteServicio } from "../../../services/servicio.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react"; // Usa Lucide para los iconos
import "./ServiciosPageAdm.css";

export const ServiciosPageAdm = () => {
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);

    // Cargar servicios
    const fetchServicios = async () => {
        setLoading(true);
        const data = await getAllServicios();
        setServicios(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    // Borrar servicio (lógico)
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;
        try {
            await deleteServicio(id);
            fetchServicios(); // Refresca la lista después de borrar
        } catch (err) {
            alert("Error al eliminar el servicio.");
        }
    };

    const serviciosFiltrados = servicios
        .filter(s => s.habilitado)
        .filter(s => s.nombreServicio.toLowerCase().includes(filtro.toLowerCase()));

    return (
        <AdminLayout>
            <div className="servicios-admin">
                <div className="servicios-header">
                    <h2>Gestión de Servicios</h2>
                    <p>Administre los servicios ofrecidos por el consultorio</p>
                </div>
                <div className="servicios-actions">
                    <input
                        type="text"
                        placeholder="Buscar servicio..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                    />
                    <button className="nuevo-servicio-btn" onClick={() => navigate("/servicios/nuevo")}>
                        + Nuevo Servicio
                    </button>

                </div>
                <div className="servicios-table-card">
                    <table className="servicios-table">
                        <thead>
                            <tr>
                                <th>Nro.</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Duración</th>
                                <th>Precio ($)</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>
                                        Cargando...
                                    </td>
                                </tr>
                            ) : serviciosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>
                                        No hay servicios registrados.
                                    </td>
                                </tr>
                            ) : (
                                serviciosFiltrados.map((s, i) => (
                                    <tr key={s.idServicio}>
                                        <td>{i + 1}</td>
                                        <td>{s.nombreServicio}</td>
                                        <td>{s.descripcion}</td>
                                        <td>{s.duracionEstimada}</td>
                                        <td>${Number(s.precio).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="icon-btn"
                                                title="Editar"
                                                onClick={() => navigate(`/servicios/${s.idServicio}/editar`)}
                                                style={{ marginRight: 8 }}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className="icon-btn"
                                                title="Eliminar"
                                                onClick={() => handleDelete(s.idServicio)}
                                            >
                                                <Trash2 size={18} color="#d32f2f" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};
