import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { registerCompra } from '../../../services/compra.service';
import { useNavigate, NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';

export const RegistrarCompraPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fechaCompra: new Date().toISOString().slice(0,10),
    proveedor: '',
    producto: '',
    total: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fechaCompra) newErrors.fechaCompra = 'La fecha es requerida';
    if (!form.proveedor.trim()) newErrors.proveedor = 'El proveedor es requerido';
    if (!form.producto.trim()) newErrors.producto = 'El producto es requerido';
    if (form.total === '' || Number(form.total) < 0) newErrors.total = 'Total debe ser >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        fechaCompra: form.fechaCompra,
        nombreProveedor: form.proveedor.trim(),
        nombreProducto: form.producto.trim(),
        precioTotalCompra: Number(form.total)
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
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Gestión de Compras</h1>
        <nav className="border-b border-gray-200 mb-6">
          <ul className="flex space-x-8">
            <li>
              <NavLink to="/compras/registrar" end className={({isActive}) =>
                `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
              }>
                Registrar Compra
              </NavLink>
            </li>
            <li>
              <NavLink to="/compras" end className={({isActive}) =>
                `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
              }>
                Historial de Compras
              </NavLink>
            </li>
            <li>
              <NavLink to="/compras/por-proveedor" end className={({isActive}) =>
                `pb-2 font-medium ${isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`
              }>
                Por Proveedor
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="bg-white rounded-2xl shadow p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">Nueva Compra</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Compra *</label>
              <input
                type="date"
                name="fechaCompra"
                value={form.fechaCompra}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.fechaCompra ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500`}
              />
              {errors.fechaCompra && <p className="text-red-500 text-xs mt-1">{errors.fechaCompra}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Proveedor *</label>
              <input
                type="text"
                name="proveedor"
                value={form.proveedor}
                onChange={handleChange}
                placeholder="Ingrese nombre del proveedor"
                className={`mt-1 block w-full border ${errors.proveedor ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500`}
              />
              {errors.proveedor && <p className="text-red-500 text-xs mt-1">{errors.proveedor}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Producto *</label>
              <input
                type="text"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                placeholder="Ingrese nombre del producto"
                className={`mt-1 block w-full border ${errors.producto ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500`}
              />
              {errors.producto && <p className="text-red-500 text-xs mt-1">{errors.producto}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total (Bs.) *</label>
              <input
                type="number"
                step="0.01"
                name="total"
                value={form.total}
                onChange={handleChange}
                placeholder="0.00"
                className={`mt-1 block w-full border ${errors.total ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500`}
              />
              {errors.total && <p className="text-red-500 text-xs mt-1">{errors.total}</p>}
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
