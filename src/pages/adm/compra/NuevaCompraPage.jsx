import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { registerCompra } from '../../../services/compra.service';
import { getAllProveedores } from '../../../services/proveedor.service';
import { getAllProductos } from '../../../services/producto.service';
import { useNavigate } from 'react-router-dom';

export const NuevaCompraPage = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    fechaCompra: new Date().toISOString().slice(0, 10),
    idProveedor: '',
    detalles: [{ idProducto: '', cantidad: 1, precioUnitario: 0 }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nombreProveedorTemp, setNombreProveedorTemp] = useState('');
  const [nombresProductosTemp, setNombresProductosTemp] = useState(['']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provs = await getAllProveedores();
        const prods = await getAllProductos();
        setProveedores(provs);
        setProductos(prods);
      } catch (error) {
        console.error('Error cargando proveedores o productos', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setNombresProductosTemp(form.detalles.map(() => ''));
  }, [form.detalles.length]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (index, field, value) => {
    const updated = [...form.detalles];
    updated[index][field] = field === 'cantidad' || field === 'precioUnitario' ? Number(value) : value;
    setForm(prev => ({ ...prev, detalles: updated }));
  };

  const addDetalle = () => {
    setForm(prev => ({
      ...prev,
      detalles: [...prev.detalles, { idProducto: '', cantidad: 1, precioUnitario: 0 }]
    }));
  };

  const removeDetalle = (index) => {
    setForm(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const calcularTotal = () => {
    return form.detalles.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        idEmpleado: 1,
        idProveedor: Number(form.idProveedor),
        fechaCompra: form.fechaCompra,
        estado: 'Pagada',
        detalles: form.detalles.map(d => ({
          idProducto: Number(d.idProducto),
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario
        }))
      };
      await registerCompra(payload);
      navigate('/compras');
    } catch (error) {
      console.error('Error al registrar compra:', error);
      alert('Ocurrió un error al registrar la compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 py-6 sm:px-8 md:px-16 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Nueva Compra</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Compra</label>
              <input
                type="date"
                name="fechaCompra"
                value={form.fechaCompra}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proveedor</label>
              <input
                list="proveedores"
                value={nombreProveedorTemp}
                placeholder="Buscar proveedor..."
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setNombreProveedorTemp(inputValue);

                  const seleccionado = proveedores.find(
                    p => p.nombreCompleto.toLowerCase() === inputValue.toLowerCase()
                  );

                  if (seleccionado) {
                    handleFormChange({ target: { name: 'idProveedor', value: seleccionado.idProveedor } });
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <datalist id="proveedores">
                {proveedores.map(p => (
                  <option key={p.idProveedor} value={p.nombreCompleto} />
                ))}
              </datalist>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium mb-2">Productos Comprados</label>
                {form.detalles.map((detalle, index) => {
                  const productoSeleccionado = productos.find(p => p.idProducto === Number(detalle.idProducto));
                  const subtotal = detalle.cantidad * detalle.precioUnitario;

                  return (
                    <div key={index} className="mb-4 grid grid-cols-5 gap-3 items-end">
                      {/* Producto */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                        <input
                          list={`productos-${index}`}
                          placeholder="Buscar producto..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={
                            detalle.idProducto && productoSeleccionado
                              ? productoSeleccionado.nombreProducto
                              : ''
                          }
                          onChange={(e) => {
                            const seleccionado = productos.find(
                              p => p.nombreProducto.toLowerCase() === e.target.value.toLowerCase()
                            );
                            if (seleccionado) {
                              handleDetalleChange(index, 'idProducto', seleccionado.idProducto);
                            }
                          }}
                        />
                        <datalist id={`productos-${index}`}>
                          {productos.map(p => (
                            <option key={p.idProducto} value={p.nombreProducto} />
                          ))}
                        </datalist>
                      </div>

                      {/* Cantidad */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={detalle.cantidad}
                          onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: 3"
                        />
                      </div>

                      {/* Precio Unitario */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Precio Unitario (Bs.)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={detalle.precioUnitario}
                          onChange={(e) => handleDetalleChange(index, 'precioUnitario', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: 10.50"
                        />
                      </div>

                      {/* Subtotal + Eliminar */}
                      <div className="text-sm font-medium text-gray-600">
                        <span className="block">Subtotal</span>
                        <span className="block">{subtotal.toFixed(2)} Bs.</span>
                        <button
                          type="button"
                          onClick={() => removeDetalle(index)}
                          className="text-red-600 hover:text-red-800 text-xs mt-1"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={addDetalle}
                className="text-blue-600 hover:underline text-sm mt-2"
              >
                + Agregar otro producto
              </button>
            </div>

            <div className="text-right text-lg font-semibold text-blue-900">
              Total: {calcularTotal().toFixed(2)} Bs.
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/compras')}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white shadow transition ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
