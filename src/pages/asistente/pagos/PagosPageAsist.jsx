import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { getCitas } from "../../../services/cita.service";
import { getAllPagos } from "../../../services/pago.service";

const statusLabel = {
    PAGADO: "Pagado",
    PENDIENTE: "No hay pago registrado"
};

const statusColors = {
    PAGADO: "bg-green-100 text-green-800 border-green-400",
    PENDIENTE: "bg-red-100 text-red-700 border-red-400"
};

export const PagosPageAsist = () => {
    const navigate = useNavigate();
    const [citas, setCitas] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [filteredCitas, setFilteredCitas] = useState([]);
    const [search, setSearch] = useState("");
    const [filterFecha, setFilterFecha] = useState("");
    const [filterPagos, setFilterPagos] = useState("ALL");
    const [loading, setLoading] = useState(false);


    // Cargar citas y pagos juntos
    useEffect(() => {
        fetchCitasYpagos();
    }, []);

    const fetchCitasYpagos = async () => {
        setLoading(true);
        try {
            const citasData = await getCitas();
            const pagosData = await getAllPagos();
            const soloHabilitadas = Array.isArray(citasData) ? citasData.filter(c => c.habilitado !== false && c.habilitado !== 0) : [];
            const pagosHabilitados = Array.isArray(pagosData) ? pagosData.filter(p => p.habilitado !== false && p.habilitado !== 0) : [];
            setCitas(soloHabilitadas);
            setPagos(pagosHabilitados);

            // Relacionar citas y pagos por idCita:
            const citasConPago = soloHabilitadas.map(cita => {
                // Puede haber varios pagos por cita, pero usualmente solo uno habilitado
                const pagosDeLaCita = pagosHabilitados.filter(p => p.idCita === cita.idCita);
                return {
                    ...cita,
                    pago: pagosDeLaCita.length > 0 ? pagosDeLaCita[0] : null, // solo el último, o puedes sumar, o poner arreglo
                };
            });
            setFilteredCitas(citasConPago);

        } finally {
            setLoading(false);
        }
    };

    // Filtro/busqueda reactiva
    useEffect(() => {
        let result = [...citas].map(cita => {
            // Asocia pago de la lista de pagos por idCita cada vez que hay cambio en pagos
            const pagosDeLaCita = pagos.filter(p => p.idCita === cita.idCita);
            return {
                ...cita,
                pago: pagosDeLaCita.length > 0 ? pagosDeLaCita[0] : null,
            };
        });

        // Búsqueda por nombre paciente o servicio
        if (search.trim()) {
            const term = search.trim().toLowerCase();
            result = result.filter(cita => {
                const paciente = cita.paciente?.persona
                    ? `${cita.paciente.persona.nombres} ${cita.paciente.persona.apellidoPaterno ?? ""} ${cita.paciente.persona.apellidoMaterno ?? ""}`.toLowerCase()
                    : "";
                const servicio = (cita.citaServicios?.map(cs => cs.servicio?.nombreServicio).join(", ") ?? "").toLowerCase();
                return paciente.includes(term) || servicio.includes(term);
            });
        }

        // Filtrar por fecha exacta (YYYY-MM-DD)
        if (filterFecha) {
            result = result.filter(cita => cita.fecha === filterFecha);
        }

        // Filtro por estado de pago
        if (filterPagos !== "ALL") {
            result = result.filter(cita => {
                const tienePago = !!cita.pago && cita.pago.habilitado !== false && cita.pago.habilitado !== 0;
                return filterPagos === "CON_PAGO" ? tienePago : !tienePago;
            });
        }

        setFilteredCitas(result);
    }, [search, filterFecha, filterPagos, citas, pagos]);

    // Para formatear fecha DD-MM-YYYY
    const formatFecha = (fecha) => {
        if (!fecha) return "";
        const [yyyy, mm, dd] = fecha.split("-");
        if (yyyy && mm && dd) return `${dd}-${mm}-${yyyy}`;
        return fecha;
    };

    return (
        <AsistLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-4 md:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">Gestión de Pagos</h1>
                            <p className="text-blue-700 mt-1">Gestiona y consulta los pagos asociados a las citas odontológicas.</p>
                        </div>
                        <button
                            onClick={() => navigate("/asistente/registrar-pago")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all"
                        >
                            + Registrar Pago
                        </button>
                    </div>
                    {/* Filtros */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-md border border-blue-200">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por paciente o servicio..."
                            className="w-full sm:w-60 border-blue-300 border rounded-lg px-2 py-1"
                        />
                        <input
                            type="date"
                            value={filterFecha}
                            onChange={e => setFilterFecha(e.target.value)}
                            className="border rounded-lg px-2 py-1 border-blue-200"
                        />
                        <select
                            value={filterPagos}
                            onChange={e => setFilterPagos(e.target.value)}
                            className="border rounded-lg px-2 py-1 border-blue-200"
                        >
                            <option value="ALL">Todos</option>
                            <option value="CON_PAGO">Solo con pago</option>
                            <option value="SIN_PAGO">Solo sin pago</option>
                        </select>
                    </div>
                    {/* Tabla */}
                    <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
                        <table className="min-w-full divide-y divide-blue-100">
                            <thead>
                                <tr>
                                    <th colSpan={7} className="text-left py-2 px-4 font-bold text-blue-700 bg-blue-100 rounded-t-2xl">
                                        {filteredCitas.length === 1
                                            ? "1 cita registrada"
                                            : `${filteredCitas.length} citas registradas`
                                        }
                                    </th>
                                </tr>
                                <tr className="bg-blue-50 text-blue-900">
                                    <th className="py-2 px-4 text-sm font-semibold">#</th>
                                    <th className="py-2 px-4 text-sm font-semibold">Fecha</th>
                                    <th className="py-2 px-4 text-sm font-semibold">Hora</th>
                                    <th className="py-2 px-4 text-sm font-semibold">Paciente</th>
                                    <th className="py-2 px-4 text-sm font-semibold">Servicio</th>
                                    <th className="py-2 px-4 text-sm font-semibold">Pago</th>
                                    <th className="py-2 px-4 text-sm font-semibold text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10">
                                            <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                                            <div className="mt-2 text-blue-400">Cargando...</div>
                                        </td>
                                    </tr>
                                ) : filteredCitas.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-blue-400 font-medium">
                                            No se encontraron citas.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCitas.map((cita, i) => {
                                        const tienePago = !!cita.pago && cita.pago.habilitado !== false && cita.pago.habilitado !== 0;
                                        // Solo calcula si tiene pago:
                                        const tieneRecibo = tienePago && Array.isArray(cita.pago.recibos) && cita.pago.recibos.length > 0;
                                        const idRecibo = tieneRecibo ? cita.pago.recibos[0].idRecibo : null;
                                        return (
                                            <tr key={cita.idCita} className="hover:bg-blue-100 even:bg-blue-50 transition-colors">
                                                <td className="py-2 px-4 text-center">{i + 1}</td>
                                                <td className="py-2 px-4 text-center">{formatFecha(cita.fecha)}</td>
                                                <td className="py-2 px-4 text-center font-mono">{cita.hora?.substring(0, 5)}</td>
                                                <td className="py-2 px-4">
                                                    {cita.paciente?.persona
                                                        ? `${cita.paciente.persona.nombres} ${cita.paciente.persona.apellidoPaterno ?? ""} ${cita.paciente.persona.apellidoMaterno ?? ""}`
                                                        : "Sin paciente"}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {(cita.citaServicios && cita.citaServicios.length > 0)
                                                        ? cita.citaServicios.map(cs => cs.servicio?.nombreServicio).join(", ")
                                                        : "-"}
                                                </td>
                                                {/* Etiqueta de pago */}
                                                <td className="py-2 px-4 text-center">
                                                    {tienePago ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-green-300 bg-green-50 text-green-800 text-xs font-semibold shadow-sm">
                                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="inline mr-1">
                                                                <circle cx="10" cy="10" r="9" fill="#d1fae5" stroke="#059669" strokeWidth="1.2" />
                                                                <path d="M7.5 10.5l2 2 3-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                            Pagado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-red-300 bg-red-50 text-red-700 text-xs font-semibold shadow-sm">
                                                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="inline mr-1">
                                                                <circle cx="10" cy="10" r="9" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
                                                                <path d="M10 6.5v4M10 13h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                            No hay pago registrado
                                                        </span>
                                                    )}
                                                </td>
                                                {/* Acciones */}
                                                <td className="py-2 px-4 text-center flex flex-wrap gap-2 justify-center">
                                                    {tienePago ? (
                                                        <>
                                                            {/* Ver Pago */}
                                                            <button
                                                                className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-lg flex items-center gap-2 px-3 py-1 shadow border border-blue-300 transition-all active:scale-95"
                                                                onClick={() => navigate(`/asistente/ver-pago/${cita.pago.idPago}`)}
                                                                title="Ver Pago"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="inline mr-1">
                                                                    <path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6zm0 10a4 4 0 110-8 4 4 0 010 8z" fill="currentColor" />
                                                                    <circle cx="10" cy="10" r="2" fill="#2563eb" />
                                                                </svg>
                                                                <span className="hidden sm:inline">Ver Pago</span>
                                                            </button>
                                                            {/* Recibo */}
                                                            {tieneRecibo ? (
                                                                <button
                                                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg flex items-center gap-2 px-3 py-1 shadow border border-cyan-700 transition-all active:scale-95"
                                                                    onClick={() => navigate(`/asistente/ver-recibo/${idRecibo}`)}
                                                                    title="Ver Recibo"
                                                                >
                                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                                        <rect x="4" y="3" width="16" height="18" rx="2" fill="#a7f3f3" stroke="#06b6d4" strokeWidth="1.5" />
                                                                        <path d="M8 8h8M8 12h8M8 16h4" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                    <span className="hidden sm:inline font-semibold">Ver Recibo</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 px-3 py-1 shadow border border-blue-700 transition-all active:scale-95"
                                                                    onClick={() => navigate(`/asistente/generar-recibo/${cita.pago.idPago}`)}
                                                                    title="Generar Recibo"
                                                                >
                                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                                        <rect x="4" y="3" width="16" height="18" rx="2" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.5" />
                                                                        <path d="M8 8h8M8 12h8M8 16h4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                    <span className="hidden sm:inline font-semibold">Generar Recibo</span>
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <button
                                                            className="bg-green-100 hover:bg-green-200 text-green-900 font-semibold rounded-lg flex items-center gap-2 px-4 py-2 shadow-md border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all active:scale-95"
                                                            onClick={() => navigate(`/asistente/registrar-pago`, { state: { idCita: cita.idCita } })}
                                                            title="Registrar Pago"
                                                        >
                                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mr-2">
                                                                <rect x="2" y="6" width="18" height="10" rx="2" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
                                                                <circle cx="11" cy="11" r="2.5" fill="#fff" stroke="#059669" strokeWidth="1.2" />
                                                                <path d="M11 9.5v3M12.5 11h-3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                            <span className="hidden sm:inline font-semibold">Registrar Pago</span>
                                                        </button>
                                                    )}
                                                </td>


                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AsistLayout>
    );
};
