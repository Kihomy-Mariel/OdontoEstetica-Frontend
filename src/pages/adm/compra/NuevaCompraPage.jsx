// src/pages/admin/compras/NuevaCompraPage.jsx
import React, { useState, useEffect } from 'react';
import { registerCompra as createCompra, getEmpleados, getProveedores } from '../../../services/compra.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

export const NuevaCompraPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idEmpleado: '',
    idProveedor: '',
    fechaCompra: '',
    estado: 'pendiente',
    precioTotalCompra: '',
  });

  const [empleados, setEmpleados] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompra({ ...formData, precioTotalCompra: parseFloat(formData.precioTotalCompra) });
      alert('Compra registrada con éxito');
      navigate('/compras');
    } catch (error) {
      console.error('Error al registrar compra:', error);
      alert('Error al registrar compra');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const empleados = await getEmpleados();
      const proveedores = await getProveedores();
      setEmpleados(empleados);
      setProveedores(proveedores);
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-blue-50 p-6 md:p-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Registrar Nueva Compra</h1>
          <p className="text-sm text-blue-500">Complete los datos de la compra</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-6 space-y-4 max-w-2xl mx-auto"
        >
          <div>
            <label className="block text-blue-800 font-semibold">Empleado</label>
            <select
              name="idEmpleado"
              value={formData.idEmpleado}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 mt-1"
              required
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map(emp => (
                <option key={emp.idEmpleado} value={emp.idEmpleado}>
                  {emp.persona?.nombres} {emp.persona?.apellidoPaterno} {emp.persona?.apellidoMaterno}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold">Proveedor</label>
            <select
              name="idProveedor"
              value={formData.idProveedor}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 mt-1"
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map(prov => (
                <option key={prov.idProveedor} value={prov.idProveedor}>
                  {prov.nombreCompleto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold">Fecha de Compra</label>
            <input
              type="date"
              name="fechaCompra"
              value={formData.fechaCompra}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-blue-800 font-semibold">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 mt-1"
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold">Total (Bs.)</label>
            <input
              type="number"
              name="precioTotalCompra"
              value={formData.precioTotalCompra}
              onChange={handleChange}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 mt-1"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Guardar Compra
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
