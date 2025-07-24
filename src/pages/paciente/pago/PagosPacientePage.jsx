import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCitasByPaciente } from "../../../services/cita.service";
import { getPagosByCita } from "../../../services/pago.service";
import { PacienteLayout } from "../../../components/layouts/PacienteLayout";
import { useAuth } from "../../../hooks/useAuth";
import { ReceiptText, FileText } from "lucide-react";

export const PagosPacientePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const idPaciente = user?.idPersona || null;

    const [rows, setRows] = useState([]);
    const [loading, setLoad] = useState(true);

    useEffect(() => {
        if (!idPaciente) return;

        (async () => {
            setLoad(true);
            try {
                // 1️⃣  Citas del paciente
                const citas = await getCitasByPaciente(idPaciente);

                // 2️⃣  Pagos de cada cita (¡ya incluyen recibos!)
                const pagos = await Promise.all(
                    citas.map(c => getPagosByCita(c.idCita))
                );

                // 3️⃣  Mezcla cita + pago principal
                const mezclados = citas.map((cita, i) => {
                    // Si tu endpoint trae array, tomas el primero habilitado
                    const pagoArr = Array.isArray(pagos[i]) ? pagos[i] : [pagos[i]];
                    const pago = pagoArr.find(p => p && p.habilitado !== false && p.habilitado !== 0) || null;
                    return { ...cita, pago };
                });

                setRows(mezclados);
            } finally { setLoad(false); }
        })();
    }, [idPaciente]);

    const fmt = f => {
        const [y, m, d] = (f || "").split("-");
        return d && m && y ? `${d}-${m}-${y}` : f;
    };

    return (
        <PacienteLayout>
            <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-10">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-4 tracking-tight">Mis Pagos</h1>
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
                    <header className="flex items-center justify-between px-6 py-4 bg-sky-100/60 border-b border-sky-200">
                        <h2 className="font-semibold text-sky-900">
                            {rows.length === 1 ? "1 cita registrada" : `${rows.length} citas registradas`}
                        </h2>
                    </header>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-sky-50/60 text-sky-800 uppercase text-xs">
                                <tr>
                                    <th className="py-3 px-4">Nro.</th>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">Servicio</th>
                                    <th className="py-3 px-4 text-center">Monto</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="py-10 text-center text-sky-400">Cargando…</td></tr>
                                ) : rows.length === 0 ? (
                                    <tr><td colSpan={6} className="py-10 text-center text-sky-400">No tienes pagos registrados aún.</td></tr>
                                ) : (
                                    rows.map((cita, idx) => {
                                        const tienePago = !!cita.pago && cita.pago.habilitado !== false;
                                        const recibos = Array.isArray(cita.pago?.recibos) ? cita.pago.recibos : [];
                                        const tieneRecibo = recibos.length > 0;
                                        const idRecibo = tieneRecibo ? recibos[0].idRecibo : null; 
                                        const montoPagado = tienePago ? Number(cita.pago.montoPagado).toFixed(2) : "-";

                                        return (
                                            <tr key={cita.idCita} className="even:bg-sky-50 hover:bg-sky-100/60 transition-colors">
                                                <td className="py-2 px-4 text-center font-mono">{idx + 1}</td>
                                                <td className="py-2 px-4">{fmt(cita.fecha)}</td>
                                                <td className="py-2 px-4">
                                                    {cita.citaServicios?.map(cs => cs.servicio?.nombreServicio).join(", ")}
                                                </td>
                                                <td className="py-2 px-4 text-center">{montoPagado} {tienePago && "Bs"}</td>
                                                <td className="py-2 px-4 text-center">
                                                    {tienePago ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs">
                                                            Pagado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs">
                                                            No registrado
                                                        </span>
                                                    )}
                                                </td>
                                                {/* ACCIONES */}
                                                <td className="py-3 px-4">
                                                    {tienePago ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <button
                                                                onClick={() => navigate(`/ver-pago-paciente/${cita.pago.idPago}`)}
                                                                className="flex items-center gap-1 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-full shadow transition"
                                                            >
                                                                <ReceiptText size={15} /> Ver Pago
                                                            </button>
                                                            {tieneRecibo ? (
                                                                <button
                                                                    onClick={() => navigate(`/ver-recibo-paciente/${idRecibo}`)}
                                                                    className="flex items-center gap-1 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white rounded-full shadow transition"
                                                                >
                                                                    <FileText size={15} /> Ver Recibo
                                                                </button>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs">
                                                                    Sin recibo registrado
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-red-500">No registrado</span>
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
            </section>
        </PacienteLayout>
    );
};
