import React, { useEffect, useState } from 'react';
import { getAllCompras } from '../../../services/compra.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const CompraPage = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCompras = async () => {
    setLoading(true);
    try {
      const data = await getAllCompras();
      setCompras(data);
    } catch (error) {
      console.error('Error al cargar compras', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-blue-50 p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Gestión de Compras</h1>
            <p className="text-sm text-blue-500">Visualice y registre las compras realizadas</p>
          </div>
          <button
            onClick={() => navigate('/compras/nueva')}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            + Nueva Compra
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">N°</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Empleado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Proveedor</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Producto</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Fecha</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-blue-800">Total (Bs.)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Cargando compras...
                  </td>
                </tr>
              ) : compras.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No hay compras registradas.
                  </td>
                </tr>
              ) : (
                compras.map((compra, index) => (
                  <tr key={compra.idCompra} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{compra.empleado?.nombre || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{compra.proveedor?.nombre || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{compra.nombreProducto || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{compra.fechaCompra}</td>
                    <td className="px-4 py-3 text-sm">{compra.estado}</td>
                    <td className="px-4 py-3 text-sm">{parseFloat(compra.precioTotalCompra).toFixed(2)} Bs.</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
