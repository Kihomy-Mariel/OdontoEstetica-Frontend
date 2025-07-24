import { useEffect, useState } from 'react';
import { getAllUsuarios } from '../../../services/usuario.service';
import { AdminLayout } from '../../../components/layouts/AdminLayout';
import { Loader2, Search } from 'lucide-react';

export const UsuariosPageAdm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllUsuarios();
        const habilitados = data.filter((usuario) => usuario.habilitado === true);
        setUsuarios(habilitados);
        setFilteredUsuarios(habilitados);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = usuarios.filter((usuario) => {
      const nombreCompleto = `${usuario.persona?.nombres} ${usuario.persona?.apellidoPaterno} ${usuario.persona?.apellidoMaterno}`.toLowerCase();
      const username = usuario.username?.toLowerCase();
      const email = usuario.persona?.email?.toLowerCase();
      const rol = usuario.rol?.nombre?.toLowerCase();

      return (
        nombreCompleto.includes(value) ||
        username.includes(value) ||
        email.includes(value) ||
        rol.includes(value)
      );
    });

    setFilteredUsuarios(filtered);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Título didáctico y amigable */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-blue-900">👥 Gestión de Usuarios</h2>
          <p className="text-blue-600 text-sm mt-1">Visualiza y busca a los usuarios habilitados según nombre, rol o correo</p>
        </div>

        {/* Buscador elegante */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por nombre, usuario, correo o rol..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
          </div>
        </div>

        {/* Tabla de usuarios */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : filteredUsuarios.length === 0 ? (
          <p className="text-gray-600 text-center">No se encontraron usuarios con ese criterio.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-blue-200 bg-white">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Nombre Completo</th>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredUsuarios.map((usuario, index) => (
                  <tr key={usuario.idUsuario} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {usuario.persona?.nombres} {usuario.persona?.apellidoPaterno} {usuario.persona?.apellidoMaterno}
                    </td>
                    <td className="px-4 py-3">{usuario.username}</td>
                    <td className="px-4 py-3">{usuario.rol?.nombre}</td>
                    <td className="px-4 py-3">{usuario.persona?.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
