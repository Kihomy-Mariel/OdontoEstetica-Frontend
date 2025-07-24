import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRecibo } from "../../../services/recibo.service";
import { getPagoById } from "../../../services/pago.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export const GenerarRecibo = () => {
  const { idPago } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    idPago: idPago || "",
    fechaEmision: new Date().toISOString().split("T")[0],
    monto: "",
    saldoPendiente: "",
    observaciones: "",
    estado: "recibido",
  });

  // 🟦 Auto-rellenar campos desde el pago
  useEffect(() => {
    const fetchPago = async () => {
      try {
        const pago = await getPagoById(idPago);
        setForm((prev) => ({
          ...prev,
          monto: pago.montoPagado,
          saldoPendiente: pago.saldoPendiente ?? 0, // asegúrate que existe ese campo
        }));
      } catch (error) {
        console.error("Error al obtener el pago", error);
        toast.error("❌ Error al cargar datos del pago");
      }
    };

    if (idPago) fetchPago();
  }, [idPago]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        idPago: Number(form.idPago),
        monto: String(form.monto).replace(",", "."),             // ✅ string decimal
        saldoPendiente: String(form.saldoPendiente).replace(",", "."), // ✅ string decimal
      };

      const reciboCreado = await createRecibo(payload);
      toast.success("✅ Recibo generado con éxito");
      navigate(`/pagos`);
    } catch (error) {
      console.error("Error al crear el recibo:", error.response?.data || error);
      toast.error(
        error?.response?.data?.message?.[0] || "❌ Error al generar el recibo"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 mt-8 rounded-xl shadow-md border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Generar Recibo</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="text-blue-700 font-semibold">ID Pago</label>
            <input
              type="number"
              name="idPago"
              value={form.idPago}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              required
              disabled
            />
          </div>

          <div>
            <label className="text-blue-700 font-semibold">Fecha de Emisión</label>
            <input
              type="date"
              name="fechaEmision"
              value={form.fechaEmision}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-blue-700 font-semibold">Monto</label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={(e) => {
                const { name, value } = e.target;
                setForm((prev) => ({
                  ...prev,
                  [name]: value.replace(",", "."), // ← esto ayuda visualmente también
                }));
              }}

              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-blue-700 font-semibold">Saldo Pendiente</label>
            <input
              type="number"
              name="saldoPendiente"
              value={form.saldoPendiente}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-blue-700 font-semibold">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              required
            >
              <option value="recibido">Recibido</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-blue-700 font-semibold">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-blue-300 rounded-md"
              rows={3}
              placeholder="Observaciones del recibo..."
            />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Generar Recibo
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
