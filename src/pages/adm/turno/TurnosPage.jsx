// src/pages/adm/turno/TurnosPage.jsx
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { getAllTurnos, deleteTurno } from "../../../services/turno.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import "./TurnosPage.css";
import { getAllAsistencias } from "../../../services/asistencia.service";

export const TurnosPage = () => {
    const [tab, setTab] = useState("calendar");
    const [date, setDate] = useState(new Date());
    const [asistencias, setAsistencias] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const navigate = useNavigate();

    // 🚀 Traer todas las asistencias
    useEffect(() => {
        (async () => {
            try {
                const all = await getAllAsistencias();
                setAsistencias(all);
            } catch (err) {
                console.error("Error cargando asistencias:", err);
            }
        })();
    }, []);



    useEffect(() => {
        (async () => {
            const data = await getAllTurnos();
            setTurnos(data);
        })();
    }, []);



    const turnosFiltrados = turnos.filter(t =>
        `${t.idTurno} ${t.nombreTurno} ${t.horaInicio} ${t.horaFin}`
            .toLowerCase()
            .includes(filtro.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm("¿Deshabilitar este turno?")) {
            await deleteTurno(id);
            setTurnos(turnos.filter(t => t.idTurno !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="turnos-page">
                <h2 className="page-title">Gestión de Turnos</h2>

                <div className="tabs">
                    <button
                        className={tab === "calendar" ? "active" : ""}
                        onClick={() => setTab("calendar")}
                    >
                        Calendario de Turnos
                    </button>
                    <button
                        className={tab === "assign" ? "active" : ""}
                        onClick={() => setTab("assign")}
                    >
                        Turnos
                    </button>
                </div>

                {tab === "calendar" && (
                    <div className="calendar-view">
                        {/* calendario */}
                        <div className="calendar-box">
                            <h3>Calendario</h3>
                            <p className="subtext">
                                Seleccione una fecha para ver los turnos asignados
                            </p>
                            <Calendar onChange={setDate} value={date} />
                        </div>

                        {/* lista real de asistencias */}
                        <div className="list-box">
                            <h3>
                                Turnos registrados el {date.toLocaleDateString()}
                            </h3>
                            <p className="subtext">
                                {asistencias.length} turnos asignados
                            </p>

                            <ul className="assignments-list">
                                {asistencias.map(a => (
                                    <li
                                        key={`${a.idEmpleado}-${a.idTurno}-${a.diaSemana}`}
                                    >
                                        {/* Información del empleado */}
                                        <div className="info">
                                            <span className="emp-name">
                                                {a.empleado.persona.nombres}{" "}
                                                {a.empleado.persona.apellidoPaterno}{" "}
                                                {a.empleado.persona.apellidoMaterno}
                                            </span>
                                            <span className="badge cargo">
                                                {a.empleado.cargo}
                                            </span>
                                            <span className="badge especialidad">
                                                {a.empleado.especialidad}
                                            </span>
                                        </div>

                                        {/* Información del turno */}
                                        <div className="turno-info">
                                            <span className="turno-name">
                                                {a.turno.nombreTurno}
                                            </span>
                                            <span className="horario">
                                                {a.horaLlegada} – {a.horaSalida}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {tab === "assign" && (
                    <>
                        <div className="controls">
                            <input
                                type="text"
                                placeholder="Buscar turno por nombre, hora, ID..."
                                className="filtro-input"
                                value={filtro}
                                onChange={e => setFiltro(e.target.value)}
                            />
                            <button
                                className="btn-nuevo"
                                onClick={() => navigate("/turno/nuevo")}
                            >
                                + Nuevo Turno
                            </button>
                        </div>
                        <div className="tabla-scroll">
                            <table className="turnos-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Fin</th>
                                        <th>Activo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {turnosFiltrados.map(t => (
                                        <tr key={t.idTurno}>
                                            <td>{t.idTurno}</td>
                                            <td>{t.nombreTurno}</td>
                                            <td>{t.horaInicio}</td>
                                            <td>{t.horaFin}</td>
                                            <td>{t.habilitado ? "✔️" : "❌"}</td>
                                            <td>
                                                <button
                                                    className="btn-editar"
                                                    onClick={() => navigate(`/turno/editar/${t.idTurno}`)}
                                                >Editar</button>
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => handleDelete(t.idTurno)}
                                                >Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};
