import { useEffect, useState } from "react";
import {
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAllRecibos, createRecibo } from "../../../services/recibo.service";
// ‼️ Si tienes un servicio de pagos, impórtalo aquí:
// import { getAllPagos } from "@/services/pago.service";
import "./recibosPage.css"

export const RecibosPage = () => {
  /* ──────────── State ──────────── */
  const [recibos, setRecibos] = useState([]);
  const [pagos, setPagos] = useState([]); // ← reemplaza con fetch real
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [enviando, setEnviando] = useState(false);

  /* ──────────── Efectos ──────────── */
  useEffect(() => {
    (async () => {
      // 1) Traer recibos para calcular el siguiente número
      const r = await getAllRecibos();
      setRecibos(r);

      // 2) Simulación de pagos (reemplaza por getAllPagos)
      setPagos([
        { id: 1, descripcion: "Pago #1 – Juan Pérez – 150 Bs." },
        { id: 2, descripcion: "Pago #2 – Ana Ruiz – 200 Bs." },
      ]);
    })();
  }, []);

  /* ──────────── Helpers ──────────── */
  const numeroRecibo = `REC-${String(recibos.length + 1).padStart(3, "0")}`;

  /* ──────────── Handlers ──────────── */
  const handleSubmit = async () => {
    if (!pagoSeleccionado) return;
    setEnviando(true);

    const dto = {
      idPago: pagoSeleccionado.id,
      fechaEmision: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      monto: 0,
      saldoPendiente: 0,
      observaciones: "Generado desde UI",
      estado: "emitido",
    };

    try {
      await createRecibo(dto);
      alert("Recibo creado correctamente");
      // Refrescar listado
      const r = await getAllRecibos();
      setRecibos(r);
    } catch (err) {
      console.error(err);
      alert("Error al crear recibo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="recibo-page">
      <h1 className="titulo">Gestión de Pagos</h1>
      <p className="subtitulo">
        Registre pagos, genere recibos y consulte el estado de pagos
      </p>

      {/* Tabs */}
      <div className="tabs">
        <button>Registrar Pago</button>
        <button>Estado de Pagos</button>
        <button>Vista Detallada</button>
        <button className="active">Generar Recibo</button>
      </div>

      <div className="content-grid">
        {/* Panel Izquierdo */}
        <section className="panel">
          <h2>Seleccionar Pago</h2>
          <p className="descripcion">
            Elija un pago para generar el recibo
          </p>

          {/* Dropdown pago */}
          <label className="label">Pago</label>
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setMostrarDropdown((s) => !s)}
            >
              {pagoSeleccionado
                ? pagoSeleccionado.descripcion
                : "Seleccionar pago"}
              {mostrarDropdown ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {mostrarDropdown && (
              <ul className="dropdown-menu">
                {pagos.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => {
                      setPagoSeleccionado(p);
                      setMostrarDropdown(false);
                    }}
                  >
                    {p.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Número de Recibo */}
          <label className="label">Número de Recibo</label>
          <input className="input" value={numeroRecibo} readOnly />

          {/* Botones */}
          <div className="botones">
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!pagoSeleccionado || enviando}
            >
              <Printer size={16} />
              {enviando ? "Generando..." : "Imprimir"}
            </button>
            <button className="btn-outline" disabled>
              <Download size={16} /> Descargar PDF
            </button>
          </div>
        </section>

        {/* Panel Derecho */}
        <aside className="preview">
          <h2>Vista Previa del Recibo</h2>
          {pagoSeleccionado ? (
            <div className="preview-box">
              <p className="placeholder">
                [Aquí se mostrará la vista previa del recibo]
              </p>
            </div>
          ) : (
            <p className="placeholder">
              Seleccione un pago para generar el recibo
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};