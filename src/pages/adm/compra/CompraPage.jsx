import React, { useEffect, useState } from 'react';
import { getAllCompras } from '../../../services/compra.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';

export const CompraPage = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true);
      try {
        const data = await getAllCompras();
        setCompras(data);
      } catch (err) {
        console.error('Error cargando historial de compras', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  // Columnas reordenadas
  const columnas = ['#', 'Producto', 'Empleado', 'Proveedor', 'Fecha', 'Estado', 'Total (Bs.)'];

  // Filtrado por producto, empleado, proveedor
  const resultadoFiltrado = compras.filter(c => {
    const nombreEmp = `${c.empleado.persona.nombres} ${c.empleado.persona.apellidoPaterno}`.toLowerCase();
    const nombreProv = c.proveedor.nombreCompleto.toLowerCase();
    const nombreProd = c.nombreProducto?.toLowerCase() || '';
    const term = busqueda.toLowerCase();
    return nombreProd.includes(term) || nombreEmp.includes(term) || nombreProv.includes(term);
  });

  return (
    <AdminLayout>
      <div className="w-full px-4 py-4 sm:px-8 md:px-16 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Gestión de Compras</h1>
        {/* Tabs */}
        <nav className="border-b border-gray-200 mb-6">
          <ul className="flex space-x-8">
            <li>
              <NavLink
                to="/compras/registrar"
                end
                className={({ isActive }) =>
                  `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
                }
              >
                Registrar Compra
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/compras"
                end
                className={({ isActive }) =>
                  `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
                }
              >
                Historial de Compras
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/compras/por-proveedor"
                end
                className={({ isActive }) =>
                  `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
                }
              >
                Por Proveedor
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Historial de Compras */}
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          {/* Buscador */}
          <div className="flex items-center px-6 py-4">
            <div className="flex items-center border rounded-lg bg-white px-3 py-2 shadow-sm w-full sm:max-w-md">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Buscar compras..."
                className="outline-none w-full"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          {/* Tabla */}
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columnas.length} className="px-4 py-6 text-center text-gray-400">
                    Cargando historial de compras...
                  </td>
                </tr>
              ) : resultadoFiltrado.length === 0 ? (
                <tr>
                  <td colSpan={columnas.length} className="px-4 py-6 text-center text-gray-400">
                    {busqueda ? 'No se encontraron resultados' : 'No hay compras registradas.'}
                  </td>
                </tr>
              ) : (
                resultadoFiltrado.map((c, idx) => (
                  <tr key={c.idCompra} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{c.nombreProducto}</td>
                    <td className="px-4 py-3 font-medium">
                      {c.empleado.persona.nombres} {c.empleado.persona.apellidoPaterno}
                    </td>
                    <td className="px-4 py-3">{c.proveedor.nombreCompleto}</td>
                    <td className="px-4 py-3">{new Date(c.fechaCompra).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{c.estado}</td>
                    <td className="px-4 py-3">{parseFloat(c.precioTotalCompra).toFixed(2)} Bs.</td>
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
