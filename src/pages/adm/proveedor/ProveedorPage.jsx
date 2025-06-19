// src/pages/Proveedores/ProveedorPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProveedores, deleteProveedor } from "../../../services/proveedor.service";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";

export const ProveedorPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  const fetchProveedores = async () => {
    const data = await getAllProveedores();
    const habilitados = data.filter((prov) => prov.habilitado);
    setProveedores(habilitados);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const proveedoresFiltrados = proveedores.filter((prov) => {
    const texto = `${prov.nombreCompleto} ${prov.direccion} ${prov.telefono} ${prov.email}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
  });

  const handleUpdate = (idProveedor) => navigate(`/proveedores/editar/${idProveedor}`);

  const handleDeleteClick = (prov) => {
    setProveedorAEliminar(prov);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteProveedor(proveedorAEliminar.idProveedor);
      fetchProveedores();
      setShowModal(false);
    } catch (error) {
      alert("Error al eliminar proveedor");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Proveedores Habilitados</h2>
          <button
            onClick={() => navigate("/proveedores/registrar")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md"
          >
            <span className="text-lg font-bold">＋</span> Añadir proveedor
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="w-full border border-blue-200 rounded-xl px-4 py-2 text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 shadow-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm sm:text-base">
            <thead>
              <tr className="bg-blue-50 text-blue-900 font-bold">
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-blue-500">
                    No hay proveedores registrados.
                  </td>
                </tr>
              ) : (
                proveedoresFiltrados.map((prov, idx) => (
                  <tr key={prov.idProveedor} className="hover:bg-blue-50/80 transition">
                    <td className="px-4 py-3 text-center text-blue-500 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3">{prov.nombreCompleto}</td>
                    <td className="px-4 py-3">{prov.direccion}</td>
                    <td className="px-4 py-3">{prov.telefono}</td>
                    <td className="px-4 py-3">{prov.email}</td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdate(prov.idProveedor)}
                        className="p-2 rounded-lg bg-blue-200 hover:bg-blue-400 text-blue-800 hover:text-white transition"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(prov)}
                        className="p-2 rounded-lg bg-red-200 hover:bg-red-400 text-red-800 hover:text-white transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4">¿Eliminar proveedor?</h3>
              <p className="text-blue-600">
                Está a punto de eliminar al proveedor <b>{proveedorAEliminar?.nombreCompleto}</b>.
                <br />
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  disabled={loadingDelete}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-700 transition"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
