import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { registerCompra } from "../../../services/compra.service";

export const RegistrarCompraPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    idEmpleado: "",
    idProveedor: "",
    nombreProducto: "",
    fechaCompra: "",
    estado: "pendiente",
    precioTotalCompra: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        idEmpleado: Number(form.idEmpleado),
        idProveedor: Number(form.idProveedor),
        precioTotalCompra: parseFloat(form.precioTotalCompra),
      };
      await registerCompra(payload);
      navigate("/compras");
    } catch (err) {
      console.error("Error al registrar compra:", err);
      if (err.response?.data?.message) {
        setError("Error: " + err.response.data.message.join(", "));
      } else {
        setError("Error inesperado al registrar compra.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center drop-shadow">
          Registrar Nueva Compra
        </h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-blue-900 font-medium mb-1">
                ID Empleado
              </label>
              <input
                type="number"
                name="idEmpleado"
                value={form.idEmpleado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-blue-900 font-medium mb-1">
                ID Proveedor
              </label>
              <input
                type="number"
                name="idProveedor"
                value={form.idProveedor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-medium mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="nombreProducto"
                value={form.nombreProducto || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-medium mb-1">
                Fecha de Compra
              </label>
              <input
                type="date"
                name="fechaCompra"
                value={form.fechaCompra}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-medium mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-blue-900 font-medium mb-1">
                Precio Total de la Compra (Bs.)
              </label>
              <input
                type="number"
                name="precioTotalCompra"
                value={form.precioTotalCompra}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-blue-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/compras")}
              className="bg-gray-300 hover:bg-gray-400 text-blue-900 font-semibold px-6 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar Compra"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
