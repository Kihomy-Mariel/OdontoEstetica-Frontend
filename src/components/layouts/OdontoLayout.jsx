import {
  LogOut,
  LayoutDashboard,
  Users,
  User,
  Calendar,
  CreditCard,
  FileText,
  CalendarDays,
  PackageSearch,
  Smile,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png"; // SIEMPRE usar import así para assets estáticos

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const MENU = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/InicioOdontologo" },
 // { label: "Empleados", icon: Users, path: "/empleados" },
  { label: "Pacientes", icon: User, path: "/pacientes" },
  { label: "Turnos", icon: Calendar, path: "/turnos" },
  { label: "Servicios", icon: Smile, path: "/servicios" },
  //{ label: "Pagos", icon: CreditCard, path: "/pagos" },
  { label: "Citas", icon: CalendarDays, path: "/citas" },
  { label: "Inventario", icon: PackageSearch, path: "/productos" },
  { label: "Proveedores", icon: PackageSearch, path: "/proveedores" },
  { label: "Compras", icon: PackageSearch, path: "/compras" },

];

export const OdontoLayout = ({ children }) => {
  const usuario = useSelector((store) => store.usuario);
  const navigate = useNavigate();

  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 w-full">
      {/* Sidebar vertical fijo */}
      <aside className="flex flex-col items-center bg-white border-r border-blue-100 px-5 py-8 w-[250px] min-w-[200px] min-h-screen shadow-xl sticky top-0 z-20">
        {/* Logo y marca */}
        <div className="flex flex-col items-center mb-7">
          <img
            src={logo}
            alt="Odonto Estética Logo"
            className="w-16 h-16 rounded-2xl border-4 border-blue-200 bg-white object-contain shadow"
            onError={e => { e.target.src = perfilDefault; }}
          />
          <span className="text-2xl font-bold text-blue-700 mt-2 tracking-tight select-none">
            Odonto<span className="text-blue-400">Estética</span>
          </span>
        </div>

        {/* Usuario */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={perfilDefault}
            alt="Perfil"
            className="w-30 h-30 rounded-full border-2 border-blue-300 object-cover mb-1"
          />
          <span className="font-semibold text-blue-700 text-base text-center whitespace-nowrap">{nombreCompleto}</span>
          <span className="text-xs text-blue-500 font-medium">{usuario.rol}</span>
        </div>

        {/* Menú navegación */}
        <nav className="flex flex-col gap-1 w-full mb-auto">
          {MENU.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-blue-800 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:outline-none transition-all font-medium"
            >
              <Icon size={20} className="shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          className="flex items-center gap-3 px-4 py-2 mt-8 rounded-xl bg-gradient-to-r from-blue-200 to-blue-100 text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all shadow border border-blue-100"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 min-h-screen px-4 md:px-10 py-8 md:py-12 transition-all bg-transparent">
        {children}
      </main>
    </div>
  );
};
