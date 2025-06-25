// src/pages/asistente/recibo/VerReciboPageAsist.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AsistLayout } from "../../../components/layouts/AsistLayout";
import { getOneRecibo } from "../../../services/recibo.service";
import { AiOutlineDownload } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import logo from "../../../assets/logo.png";

export const VerReciboPageAsist = () => {
  const { idRecibo } = useParams();
  const navigate = useNavigate();
  const [recibo, setRecibo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getOneRecibo(idRecibo);
        if (!data) throw new Error();
        setRecibo(data);
      } catch {
        setError("No se pudo obtener la información del recibo.");
      } finally {
        setLoading(false);
      }
    })();
  }, [idRecibo]);

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [yyyy, mm, dd] = fecha.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // --- Estados de carga / error / no encontrado ---
  if (loading) {
    return (
      <AsistLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400" />
        </div>
      </AsistLayout>
    );
  }

  if (error) {
    return (
      <AsistLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-red-400 text-center">
            <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>
      </AsistLayout>
    );
  }

  if (!recibo) {
    return (
      <AsistLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-400 text-center">
            <p className="text-blue-600 font-bold text-lg mb-4">Recibo no encontrado</p>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>
      </AsistLayout>
    );
  }

  // --- Datos ya seguros de existir ---
  const pago = recibo.pago || {};
  const cita = pago.cita || {};
  const persona = cita.paciente?.persona || {};
  const servicios = cita.citaServicios || [];

  return (
    <AsistLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center p-4 md:p-10">
        {/* Botón descargar PDF */}
        <div className="flex justify-end w-full max-w-2xl mb-3">
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow font-bold">
                <AiOutlineDownload className="text-xl" />
                Descargar PDF
              </button>
            )}
            content={() => printRef.current}
            documentTitle={`Recibo_OdontoEstetica_${recibo.idRecibo}`}
          />
        </div>

        {/* Contenedor del recibo */}
        <div
          ref={printRef}
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
                  className={`font-bold ${
                    recibo.estado === "recibido" ? "text-green-600" : "text-yellow-600"
                  }`}
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

          {/* Tabla de Servicios */}
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
                    <tr key={cs.idCitaServicio} className="even:bg-blue-100">
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

          {/* Botón Volver */}
          <div className="flex justify-center print:hidden">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-2 shadow"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>

          {/* Pie */}
          <p className="mt-6 text-center text-xs text-blue-400">
            Gracias por confiar en OdontoEstética
          </p>
        </div>
      </div>
    </AsistLayout>
  );
};
