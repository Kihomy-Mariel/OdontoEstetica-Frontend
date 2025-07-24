import { useState } from "react";
import {
  LogOut,
  Home,
  Calendar,
  Stethoscope,
  CreditCard,  // icono para pagos
  FileText,    // icono para recibos (antes FileInvoice)
  Users,       // icono para pacientes
  Clock,       // icono para turnos
  Menu,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const MENU_ASISTENTE = [
  { label: "Inicio", icon: Home, path: "/inicio-asistente" },
  { label: "Pacientes", icon: Users, path: "/asistente/pacientes" },
  { label: "Citas", icon: Calendar, path: "/asistente/citas" },
  { label: "Servicios", icon: Stethoscope, path: "/asistente/servicios" },
  { label: "Pagos", icon: CreditCard, path: "/asistente/pagos" },
  { label: "Turnos", icon: Clock, path: "/asistente/turnos" },
];

export const AsistLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const usuario = useSelector((store) => store.usuario);
  const navigate = useNavigate();
  const location = useLocation();

  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 w-full">
      {/* Botón de menú móvil */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-30 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md transition-colors duration-200"
        aria-expanded={mobileMenuOpen}
        aria-label="Menú de navegación"
      >
        {mobileMenuOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <Menu size={24} aria-hidden="true" />
        )}
      </button>

      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-xs md:hidden transition-all duration-300 ease-in-out"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Versión móvil y desktop */}
      <aside
        className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transform fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-blue-100 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out`}
        aria-label="Barra lateral de navegación"
      >
        <div className="flex flex-col h-full px-5 py-8 overflow-y-auto">
          {/* Botón de cierre para móvil */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>

          {/* Logo y marca */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Logo de Odonto Estética"
              className="w-20 h-20 rounded-2xl border-4 border-blue-200 bg-white object-contain shadow"
              onError={(e) => {
                e.target.src = perfilDefault;
              }}
            />
            <h1 className="text-2xl font-bold text-blue-800 mt-3 tracking-tight">
              Odonto<span className="text-blue-500">Estética</span>
            </h1>
          </div>

          {/* Información del usuario */}
          <div className="flex flex-col items-center mb-8 px-4 text-center">
            <img
              src={usuario.foto || perfilDefault}
              alt={`Foto de perfil de ${nombreCompleto}`}
              className="w-24 h-24 rounded-full border-2 border-blue-300 object-cover mb-3 shadow-sm"
            />
            <h2 className="font-semibold text-blue-800 text-lg">{nombreCompleto}</h2>
            <span className="text-sm text-blue-500 bg-blue-50 px-3 py-1 rounded-full mt-1 capitalize">
              {usuario.rol}
            </span>
          </div>

          {/* Menú de navegación */}
          <nav className="flex flex-col gap-2 w-full mb-auto" role="menu" aria-label="Menú principal">
            {MENU_ASISTENTE.map(({ label, icon: Icon, path }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-blue-800 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium
                  ${location.pathname === path ? "bg-blue-50 text-blue-700 font-semibold" : ""}`}
                aria-current={location.pathname === path ? "page" : undefined}
                role="menuitem"
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-left truncate">{label}</span>
              </button>
            ))}
          </nav>

          {/* Botón de cierre de sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 mt-6 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition-colors shadow-sm border border-blue-200"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-transparent">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
