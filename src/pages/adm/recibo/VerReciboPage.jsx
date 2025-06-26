import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getOneRecibo } from "../../../services/recibo.service";
import { AiOutlineDownload } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { ReciboImprimible } from "./ReciboImprimible";

export const VerReciboPage = () => {
  const { idRecibo }  = useParams();
  const navigate      = useNavigate();
  const [recibo, setRecibo]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  /* ref que será consumido por react-to-print */
  const printRef = useRef(null);

  /* ──────────── obtener recibo ──────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getOneRecibo(idRecibo);
        if (!data) throw new Error("Sin datos");
        setRecibo(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo obtener la información del recibo.");
      } finally {
        setLoading(false);
      }
    })();
  }, [idRecibo]);

  /* ──────────── impresión ──────────── */
  const handlePrint = useReactToPrint({
    content       : () => printRef.current,
    documentTitle : `Recibo_OdontoEstetica_${idRecibo}`,
    removeAfterPrint: true,           // opcional
  });

  /* ──────────── estados intermedios ──────────── */
  if (loading) return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400" />
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
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
    </AdminLayout>
  );

  /* ──────────── render final ──────────── */
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center p-4 md:p-10">
        {/* Botón imprimir */}
        <div className="flex justify-end w-full max-w-2xl mb-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow font-bold"
          >
            <AiOutlineDownload className="text-xl" />
            Descargar PDF
          </button>
        </div>

        {/* Recibo imprimible */}
        <ReciboImprimible ref={printRef} recibo={recibo} />

        {/* Botón volver (no sale en impresión) */}
        <div className="flex justify-center mt-8 print:hidden">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-2 shadow"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
