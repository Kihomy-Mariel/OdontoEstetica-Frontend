import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { registerProveedor } from "../../../services/proveedor.service";

export const RegistrarProveedorPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    email: ""
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
      const cleanForm = {
        ...form,
        telefono: parseInt(form.telefono, 10),
      };

      console.log("Datos enviados al backend:", cleanForm); // Puedes quitar esto después

      await registerProveedor(cleanForm);
      navigate("/proveedores");
    } catch (err) {
      console.error("Detalles del error:", err.response?.data || err.message);
      let message = "Error inesperado al registrar proveedor.";
      if (err.response?.data?.message) {
        message = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message;
      }
      setError("Error al registrar proveedor: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center drop-shadow">
          Registrar Nuevo Proveedor
        </h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-blue-900 font-medium mb-1">
                Teléfono
              </label>
              <input
                type="number"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-900 font-medium mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-blue-900 font-medium mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-blue-900 font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              className="bg-gray-300 hover:bg-gray-400 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
