import React, { useEffect, useState } from 'react';
import { getAllCompras } from '../../../services/compra.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export const CompraPage = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const navigate = useNavigate();

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

  const columnas = ['Nro. de Compra', 'Productos', 'Empleado', 'Proveedor', 'Fecha', 'Estado', 'Total (Bs.)', ''];

  const resultadoFiltrado = compras.filter(c => {
    const nombreEmp = `${c.empleado.persona.nombres} ${c.empleado.persona.apellidoPaterno}`.toLowerCase();
    const nombreProv = c.proveedor.nombreCompleto.toLowerCase();
    const nombreProd = c.detalles?.map(d => d.producto?.nombreProducto).join(', ').toLowerCase() || '';
    const term = busqueda.toLowerCase();
    return nombreProd.includes(term) || nombreEmp.includes(term) || nombreProv.includes(term);
  });

  const totalPaginas = Math.ceil(resultadoFiltrado.length / elementosPorPagina);
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const comprasPaginadas = resultadoFiltrado.slice(inicio, fin);

  const toggleDetalles = (idCompra) => {
    setDetallesVisibles((prev) => ({ ...prev, [idCompra]: !prev[idCompra] }));
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 py-6 sm:px-8 md:px-16 bg-blue-50 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Compras</h1>
          <button
            onClick={() => navigate('/compras/registrar')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            Registrar Compra
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <div className="flex items-center border border-blue-300 rounded-xl bg-white px-4 py-2 shadow-sm w-full sm:max-w-md">
            <Search className="text-blue-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Buscar por producto, empleado o proveedor"
              className="outline-none w-full text-sm text-blue-900"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1); // Reinicia a la primera página al buscar
              }}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full text-sm text-blue-900">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {loading ? (
                <tr>
                  <td colSpan={columnas.length} className="px-4 py-6 text-center text-blue-400">
                    Cargando historial de compras...
                  </td>
                </tr>
              ) : comprasPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={columnas.length} className="px-4 py-6 text-center text-blue-400">
                    {busqueda ? 'No se encontraron resultados' : 'No hay compras registradas.'}
                  </td>
                </tr>
              ) : (
                comprasPaginadas.map((c, idx) => (
                  <React.Fragment key={c.idCompra}>
                    <tr className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3">{inicio + idx + 1}</td>
                      <td className="px-4 py-3">
                        {c.detalles?.map(d => d.producto?.nombreProducto).join(', ')}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {c.empleado?.persona?.nombres} {c.empleado?.persona?.apellidoPaterno}
                      </td>
                      <td className="px-4 py-3">{c.proveedor?.nombreCompleto}</td>
                      <td className="px-4 py-3">{new Date(c.fechaCompra).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ['Pagada', 'Completada', 'Comprado', 'comprado'].includes(c.estado)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">{parseFloat(c.precioTotalCompra).toFixed(2)} Bs.</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleDetalles(c.idCompra)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title={detallesVisibles[c.idCompra] ? 'Ocultar detalles' : 'Mostrar detalles'}
                        >
                          {detallesVisibles[c.idCompra] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>

                    {detallesVisibles[c.idCompra] && (
                      <tr className="bg-blue-50">
                        <td colSpan={8} className="px-6 pb-4 pt-2">
                          <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
                            <p className="text-blue-900 font-semibold mb-2">Productos Comprados:</p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-xs text-blue-800">
                                <thead>
                                  <tr className="bg-blue-100">
                                    <th className="text-left py-2 px-3">#</th>
                                    <th className="text-left py-2 px-3">Producto</th>
                                    <th className="text-left py-2 px-3">Cantidad</th>
                                    <th className="text-left py-2 px-3">Precio Unitario</th>
                                    <th className="text-left py-2 px-3">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {c.detalles?.map((detalle, i) => (
                                    <tr key={i} className="border-t border-blue-100">
                                      <td className="py-2 px-3">{i + 1}</td>
                                      <td className="py-2 px-3">{detalle.producto?.nombreProducto}</td>
                                      <td className="py-2 px-3">{detalle.cantidad}</td>
                                      <td className="py-2 px-3">{parseFloat(detalle.precioUnitario).toFixed(2)} Bs.</td>
                                      <td className="py-2 px-3">
                                        {(detalle.cantidad * detalle.precioUnitario).toFixed(2)} Bs.
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-6 gap-3">
            <button
              className="px-4 py-1.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span className="text-blue-700 font-semibold text-sm self-center">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="px-4 py-1.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
