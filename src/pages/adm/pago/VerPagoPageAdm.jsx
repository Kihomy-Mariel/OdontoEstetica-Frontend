import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getPagoById } from "../../../services/pago.service";

export const VerPagoPageAdm = () => {
  const { idPago } = useParams();
  const navigate = useNavigate();
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const pagoData = await getPagoById(idPago);
        setPago(pagoData);
      } catch (err) {
        setError("No se pudo obtener la información del pago.");
      } finally {
        setLoading(false);
      }
    })();
  }, [idPago]);

  // Utilidad para formato fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [yyyy, mm, dd] = fecha.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // Loader y error
  if (loading)
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
        </div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-red-400 text-center">
            <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>
      </AdminLayout>
    );

  if (!pago)
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-400 text-center">
            <p className="text-blue-700 font-bold text-lg mb-4">Pago no encontrado</p>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>
      </AdminLayout>
    );

  // Desestructurar la info relevante
  const cita = pago.cita || {};
  const paciente = cita.paciente || {};
  const persona = paciente.persona || {};
  const servicios = cita.citaServicios || [];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center p-4 md:p-10">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-8 border-blue-400">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
            <h1 className="text-3xl font-extrabold text-blue-900">
              Detalle del Pago
            </h1>
            <button
              className="px-4 py-2 bg-blue-50 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg border border-blue-300 transition"
              onClick={() => navigate("/pagos")}
            >
              Volver a la lista
            </button>
          </div>

          {/* Bloque de pago */}
          <section className="mb-7">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Fecha de Pago</span>
                <span className="block text-blue-900 text-lg">{formatFecha(pago.fechaPago)}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Monto Pagado (Bs.)</span>
                <span className="block text-blue-900 text-lg">{Number(pago.montoPagado).toLocaleString("es-BO", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Método de Pago</span>
                <span className="block text-blue-900 text-lg">{pago.formaPago}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Estado</span>
                <span className={`block text-lg font-semibold ${pago.estado === "PAGADO" ? "text-green-600" : "text-yellow-600"}`}>
                  {pago.estado}
                </span>
              </div>
              {pago.observaciones && (
                <div className="flex-1 min-w-[180px]">
                  <span className="block text-blue-700 font-semibold mb-1">Observaciones</span>
                  <span className="block text-blue-900">{pago.observaciones}</span>
                </div>
              )}
            </div>
          </section>

          <hr className="my-6 border-blue-100" />

          {/* Bloque de cita */}
          <section className="mb-7">
            <h2 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              <svg width={22} height={22} fill="none" viewBox="0 0 24 24" className="inline"><circle cx="12" cy="12" r="10" fill="#bae6fd"/><path d="M8 11h8v2H8v-2zm0-2v-1a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#0369a1" strokeWidth="1.2"/></svg>
              Información de la Cita
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Fecha</span>
                <span className="block text-blue-900">{formatFecha(cita.fecha)}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Hora</span>
                <span className="block text-blue-900">{cita.hora?.substring(0, 5)}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Motivo</span>
                <span className="block text-blue-900">{cita.motivo}</span>
              </div>
            </div>
          </section>

          {/* Paciente */}
          <section className="mb-7">
            <h2 className="text-xl font-bold text-blue-800 mb-3">Paciente</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Nombre Completo</span>
                <span className="block text-blue-900">{`${persona.nombres || ""} ${persona.apellidoPaterno || ""} ${persona.apellidoMaterno || ""}`}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">CI</span>
                <span className="block text-blue-900">{persona.ci || "-"}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Teléfono</span>
                <span className="block text-blue-900">{persona.telefono || "-"}</span>
              </div>
              <div className="flex-1 min-w-[180px]">
                <span className="block text-blue-700 font-semibold mb-1">Email</span>
                <span className="block text-blue-900">{persona.email || "-"}</span>
              </div>
            </div>
          </section>

          {/* Servicios asociados */}
          <section>
            <h2 className="text-xl font-bold text-blue-800 mb-3">Servicios de la Cita</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-blue-50 rounded-lg shadow border">
                <thead>
                  <tr className="bg-blue-200 text-blue-900">
                    <th className="px-2 py-1 text-left">Servicio</th>
                    <th className="px-2 py-1 text-left">Descripción</th>
                    <th className="px-2 py-1 text-right">Precio (Bs.)</th>
                    <th className="px-2 py-1 text-right">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.length > 0 ? (
                    servicios.map(cs => (
                      <tr key={cs.idCitaServicio} className="even:bg-blue-100">
                        <td className="px-2 py-1">{cs.servicio?.nombreServicio || "-"}</td>
                        <td className="px-2 py-1">{cs.servicio?.descripcion || "-"}</td>
                        <td className="px-2 py-1 text-right">
                          {cs.servicio?.precio
                            ? Number(cs.servicio.precio).toLocaleString("es-BO", { minimumFractionDigits: 2 })
                            : "0.00"}
                        </td>
                        <td className="px-2 py-1 text-right">{cs.cantidadServicio || 1}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-3 text-gray-400 italic">
                        No hay servicios asociados a esta cita.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};
