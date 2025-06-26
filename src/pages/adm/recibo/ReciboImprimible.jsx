import React, { forwardRef } from "react";
import logo from "../../../assets/logo.png"; // Asegúrate de que la ruta sea correcta

/* 
 * forwardRef permite que VerReciboPage coloque un ref externo
 * directamente sobre el <div> raíz del recibo.
 */
export const ReciboImprimible = forwardRef(({ recibo }, ref) => {
  const pago      = recibo.pago          ?? {};
  const cita      = pago.cita            ?? {};
  const persona   = cita.paciente?.persona ?? {};
  const servicios = cita.citaServicios   ?? [];

  const formatFecha = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };


  return (
    <div
      ref={ref}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-t-8 border-blue-400 px-6 py-10 md:px-12 relative print:px-4 print:py-6 print:shadow-none print:border-t-4"
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo OdontoEstética" className="w-16 h-16 mb-2 rounded-full shadow" />
        <h1 className="text-3xl font-bold text-blue-900 mb-1">OdontoEstética</h1>
        <p className="text-blue-600 font-semibold text-sm">Consultorio Dental</p>
      </div>

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-800">Recibo de Pago</h2>
        <span className="text-blue-700 font-medium">{formatFecha(recibo.fechaEmision)}</span>
      </div>

      {/* Datos Paciente / Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
        <div>
          <p className="text-blue-700 font-semibold">Paciente</p>
          <p className="text-blue-900 font-bold">
            {`${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`}
          </p>
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">CI:</span> {persona.ci || "-"}<br />
            <span className="font-semibold">Teléfono:</span> {persona.telefono || "-"}<br />
            <span className="font-semibold">Email:</span> {persona.email || "-"}
          </p>
        </div>
        <div>
          <p className="text-blue-700 font-semibold">Datos del Pago</p>
          <p className="text-blue-900">
            <span className="font-semibold">Monto:</span>{" "}
            {Number(pago.montoPagado).toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.<br />
            <span className="font-semibold">Método:</span> {pago.formaPago}<br />
            <span className="font-semibold">Estado:</span>{" "}
            <span className={pago.estado === "pagado" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
              {pago.estado}
            </span><br />
            <span className="font-semibold">Fecha Pago:</span> {formatFecha(pago.fechaPago)}
          </p>
        </div>
      </div>

      {/* Resumen Recibo */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-blue-700 font-semibold">Monto Recibo</p>
            <p className="text-blue-900 font-bold">
              {Number(recibo.monto).toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.
            </p>
          </div>
          <div>
            <p className="text-blue-700 font-semibold">Saldo Pendiente</p>
            <p className="text-blue-900 font-bold">
              {Number(recibo.saldoPendiente).toLocaleString("es-BO", { minimumFractionDigits: 2 })} Bs.
            </p>
          </div>
          <div>
            <p className="text-blue-700 font-semibold">Estado Recibo</p>
            <p
              className={`font-bold ${recibo.estado === "recibido" ? "text-green-600" : "text-yellow-600"}`}
            >
              {recibo.estado}
            </p>
          </div>
        </div>

        {recibo.observaciones && (
          <p className="mt-3 text-blue-700">
            <span className="font-semibold">Observaciones:</span> {recibo.observaciones}
          </p>
        )}
      </div>

      {/* Tabla de servicios */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-800 mb-2">Servicios realizados</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-blue-50 rounded-lg border border-blue-100">
            <thead>
              <tr className="bg-blue-200 text-blue-900">
                <th className="px-3 py-1 text-left">Servicio</th>
                <th className="px-3 py-1 text-left">Descripción</th>
                <th className="px-3 py-1 text-right">Precio</th>
                <th className="px-3 py-1 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((cs) => (
                <tr
                  key={`${cs.idCitaServicio}-${cs.servicio?.idServicio ?? 0}`}
                  className="even:bg-blue-100"
                >
                  <td className="px-3 py-1">{cs.servicio.nombreServicio}</td>
                  <td className="px-3 py-1">{cs.servicio.descripcion}</td>
                  <td className="px-3 py-1 text-right">
                    {Number(cs.servicio.precio).toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-1 text-right">{cs.cantidadServicio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-blue-400">
        Gracias por confiar en OdontoEstética
      </p>
    </div>
  );
});
