import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { getCitas } from "../../../services/cita.service";
import { createPago } from "../../../services/pago.service";

const metodosPago = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "QR", label: "QR" },
  { value: "Tarjeta", label: "Tarjeta" },
];

export const PagoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const idCitaProp = location.state?.idCita || "";

  const [citas, setCitas] = useState([]);
  const [idCita, setIdCita] = useState(idCitaProp);
  const [cita, setCita] = useState(null);

  // Campos de pago
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().split("T")[0]);
  const [montoPagado, setMontoPagado] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [estado] = useState("PAGADO");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Trae citas habilitadas con relaciones
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getCitas();
      // Solo citas habilitadas
      const habilitadas = (Array.isArray(data) ? data : []).filter(c => c.habilitado !== false && c.habilitado !== 0);
      setCitas(habilitadas);
      // Si llega idCita por props, selecciona y carga
      if (idCitaProp) {
        const found = habilitadas.find(c => c.idCita === idCitaProp || c.idCita === Number(idCitaProp));
        setCita(found || null);
      }
      setLoading(false);
    })();
  }, [idCitaProp]);

  // Al elegir cita, actualiza datos relacionados
  useEffect(() => {
    if (idCita) {
      const found = citas.find(c => c.idCita === Number(idCita));
      setCita(found || null);
    } else {
      setCita(null);
    }
  }, [idCita, citas]);

  // Suma el precio de todos los servicios de la cita
  const totalServicios = cita?.citaServicios?.reduce(
    (sum, cs) => sum + (parseFloat(cs.servicio?.precio) || 0),
    0
  ) || 0;

  // Feedback helpers
  const handleSuccess = (txt) => {
    setMsg(txt);
    setTimeout(() => {
      setMsg("");
      navigate("/asistente/pagos");
    }, 1200);
  };
  const handleError = (txt) => {
    setError(txt);
    setTimeout(() => setError(""), 2000);
  };

  const handleSetTotal = () => {
    setMontoPagado(totalServicios.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCita || !fechaPago || !montoPagado || !formaPago) {
      handleError("Completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const nuevoPago = {
        idCita: Number(idCita),
        fechaPago,
        montoPagado: Number(montoPagado),
        formaPago,
        estado: "PAGADO",
      };
      await createPago(nuevoPago);
      handleSuccess("Pago registrado correctamente.");
  } catch (err) {
    console.error("Error al crear pago (frontend):", err); // <-- AQUÍ
    handleError("Ocurrió un error al registrar el pago.");
  } finally {
    setLoading(false);
  }
  };

  // Formatea fecha DD-MM-YYYY
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [yyyy, mm, dd] = fecha.split("-");
    if (yyyy && mm && dd) return `${dd}-${mm}-${yyyy}`;
    return fecha;
  };

  return (
    <AsistLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-4 md:p-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-7 md:p-10 border-t-8 border-blue-400 relative">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 text-center">Registrar Pago</h1>
            <p className="text-blue-700 text-center mb-6">Asocia el pago a una cita odontológica.</p>

            {msg && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 p-3 rounded">{msg}</div>}
            {error && <div className="mb-4 bg-red-100 border-red-400 text-red-700 p-3 rounded">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Seleccionar cita */}
              <div>
                <label className="font-semibold text-blue-800 block mb-1">Cita <span className="text-red-500">*</span></label>
                <select
                  value={idCita}
                  onChange={e => setIdCita(e.target.value)}
                  disabled={!!idCitaProp}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  required
                >
                  <option value="">Seleccionar cita</option>
                  {citas.map(c => (
                    <option key={c.idCita} value={c.idCita}>
                      {formatFecha(c.fecha)} - {c.hora?.substring(0,5)} | {c.paciente?.persona?.nombres} {c.paciente?.persona?.apellidoPaterno ?? ""} {c.paciente?.persona?.apellidoMaterno ?? ""}
                    </option>
                  ))}
                </select>
              </div>
              {/* Datos cita seleccionada */}
              {cita && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                    <svg width={20} height={20} className="inline text-blue-600" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#bae6fd"/><path d="M8 11h8v2H8v-2zm0-2v-1a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#0369a1" strokeWidth="1.2"/></svg>
                    {cita.paciente?.persona?.nombres} {cita.paciente?.persona?.apellidoPaterno ?? ""} {cita.paciente?.persona?.apellidoMaterno ?? ""}
                  </div>
                  <div className="flex flex-wrap gap-3 text-blue-700 text-sm mt-2">
                    <div>
                      <span className="font-semibold">Fecha: </span>{formatFecha(cita.fecha)}
                    </div>
                    <div>
                      <span className="font-semibold">Hora: </span>{cita.hora?.substring(0,5)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold text-blue-800">Motivo:</span> {cita.motivo}
                  </div>
                  {/* Tabla de servicios y precios */}
                  <div className="mt-4">
                    <span className="font-semibold text-blue-800">Servicios:</span>
                    {cita.citaServicios?.length > 0 ? (
                      <div className="mt-2">
                        <table className="min-w-full border text-sm rounded overflow-hidden">
                          <thead>
                            <tr className="bg-blue-200 text-blue-900">
                              <th className="px-2 py-1 text-left">Servicio</th>
                              <th className="px-2 py-1 text-right">Precio (Bs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cita.citaServicios.map(cs => (
                              <tr key={cs.idCitaServicio} className="even:bg-blue-50">
                                <td className="px-2 py-1">{cs.servicio?.nombreServicio ?? "-"}</td>
                                <td className="px-2 py-1 text-right">
                                  {cs.servicio?.precio
                                    ? Number(cs.servicio.precio).toLocaleString('es-BO', { minimumFractionDigits: 2 })
                                    : "0.00"
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="font-semibold px-2 py-1 text-right">Total</td>
                              <td className="font-semibold px-2 py-1 text-right text-blue-700">
                                {totalServicios.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                        <button
                          type="button"
                          className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-3 py-1 shadow-sm border border-blue-200 transition-all"
                          onClick={handleSetTotal}
                        >
                          Usar Total de Servicios ({totalServicios.toLocaleString('es-BO', { minimumFractionDigits: 2 })} Bs)
                        </button>
                      </div>
                    ) : (
                      <div className="italic text-gray-400 mt-2">Sin servicios registrados</div>
                    )}
                  </div>
                </div>
              )}

              {/* Formulario pago */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px]">
                  <label className="font-semibold text-blue-800 block mb-1">Fecha de Pago <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={e => setFechaPago(e.target.value)}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="font-semibold text-blue-800 block mb-1">Monto Pagado (Bs.) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoPagado}
                    onChange={e => setMontoPagado(e.target.value)}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px]">
                  <label className="font-semibold text-blue-800 block mb-1">Método de Pago <span className="text-red-500">*</span></label>
                  <select
                    value={formaPago}
                    onChange={e => setFormaPago(e.target.value)}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">Seleccionar método</option>
                    {metodosPago.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  mt-2 w-full py-3 rounded-xl font-extrabold
                  bg-blue-600 text-white hover:bg-blue-700
                  shadow-xl transition-all text-lg
                  active:scale-95 disabled:opacity-60 disabled:pointer-events-none
                `}
              >
                {loading ? "Registrando..." : "Registrar Pago"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AsistLayout>
  );
};
