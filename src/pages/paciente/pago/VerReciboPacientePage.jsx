import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PacienteLayout } from "../../../components/layouts/PacienteLayout";
import { getOneRecibo } from "../../../services/recibo.service";
import { AiOutlineDownload } from "react-icons/ai";
import html2pdf from "html2pdf.js";
import { ReciboImprimiblePaciente } from "./ReciboImprimiblePaciente";

export const VerReciboPacientePage = () => {
  const { idRecibo } = useParams();
  const navigate = useNavigate();
  const [recibo, setRecibo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const handlePrintPopup = () => {
    const content = printRef.current;

    if (!content) {
      console.error("❌ No se encontró el contenido a imprimir.");
      return;
    }

    // Clonamos el contenido del recibo
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      alert("No se pudo abrir la ventana de impresión.");
      return;
    }

    // Preparamos estilos básicos (puedes poner también estilos propios)
    const style = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
      img { max-width: 100px; }
    </style>
  `;

    printWindow.document.write(`
    <html>
<head>
  <title>Recibo OdontoEstética</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  ${style}
</head>

      <body>
        ${content.innerHTML}
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 500);
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };




  /* ──────────── estados intermedios ──────────── */
  if (loading) return (
    <PacienteLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400" />
      </div>
    </PacienteLayout>
  );

  if (error) return (
    <PacienteLayout>
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
    </PacienteLayout>
  );

  /* ──────────── render final ──────────── */
  return (
    <PacienteLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col items-center p-4 md:p-10">
        {/* Botón imprimir */}
        <div className="flex justify-end w-full max-w-2xl mb-3">
          <button
            onClick={handlePrintPopup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow font-bold"
          >
            <AiOutlineDownload className="text-xl" />
            Descargar PDF
          </button>


        </div>

        {/* Recibo imprimible */}
        <ReciboImprimiblePaciente ref={printRef} recibo={recibo} />

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
    </PacienteLayout>
  );
};
