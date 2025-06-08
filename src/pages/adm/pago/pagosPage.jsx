// src/pages/Pagos.jsx
import { useState, useEffect } from "react";
import { createPago, getAllPagos } from "../../../services/pago.service";
import "./pagosPage.css";

export const PagosPage = () => {
  const [paciente, setPaciente] = useState("");
  const [servicio, setServicio] = useState("");
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const cargarPagos = async () => {
      const datos = await getAllPagos();
      setPagos(datos);
    };
    cargarPagos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoPago = {
      paciente,
      servicio,
      monto,
      metodo,
      referencia,
      observaciones,
    };
    await createPago(nuevoPago);
    setPaciente("");
    setServicio("");
    setMonto("");
    setMetodo("");
    setReferencia("");
    setObservaciones("");
  };

  return (
    <div className="pagos-container">
      <h1>Gestión de Pagos</h1>
      <p>Registre pagos, genere recibos y consulte el estado de pagos</p>

      <div className="tabs">
        <button className="active">Registrar Pago</button>
        <button>Estado de Pagos</button>
        <button>Vista Detallada</button>
        <button>Generar Recibo</button>
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <h2>Registrar Pago</h2>

        <label>Paciente</label>
        <select value={paciente} onChange={(e) => setPaciente(e.target.value)}>
          <option value="">Seleccionar paciente</option>
          <option value="Paciente A">Paciente A</option>
          <option value="Paciente B">Paciente B</option>
        </select>

        <label>Servicio</label>
        <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
          <option value="">Seleccionar servicio</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Ortodoncia">Ortodoncia</option>
        </select>

        <div className="fila">
          <div>
            <label>Monto (Bs.)</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
          <div>
            <label>Método de Pago</label>
            <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
              <option value="">Seleccionar método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <label>Referencia/Número de Transacción</label>
        <input
          type="text"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          placeholder="Número de referencia (opcional)"
        />

        <label>Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones adicionales sobre el pago"
        ></textarea>

        <button type="submit" className="btn-registrar">Registrar Pago</button>
      </form>
    </div>
  );
};