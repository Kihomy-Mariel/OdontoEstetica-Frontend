import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { getOneProveedor, updateProveedor } from "../../../services/proveedor.service";

export const EditarProveedorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nombreCompleto: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const data = await getOneProveedor(id);
        setForm(data);
      } catch (err) {
        console.error("Error al obtener proveedor:", err);
        setError("Error al obtener proveedor.");
      }
    };
    fetchProveedor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        nombreCompleto: form.nombreCompleto,
        direccion: form.direccion,
        telefono: Number(form.telefono),
        email: form.email,
      };

      await updateProveedor(id, payload);
      navigate("/proveedores");
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message || "Error desconocido";
      console.error("Error al actualizar proveedor:", backendMessage);
      setError(`Error al actualizar proveedor: ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center drop-shadow">
          Editar Proveedor
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 border border-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl border border-blue-100 p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-blue-900 font-semibold mb-1">
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
              <label className="block text-blue-900 font-semibold mb-1">
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

            <div className="md:col-span-2">
              <label className="block text-blue-900 font-semibold mb-1">
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

            <div className="md:col-span-2">
              <label className="block text-blue-900 font-semibold mb-1">
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
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              className="bg-gray-300 hover:bg-gray-400 text-blue-900 font-semibold px-6 py-2 rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};