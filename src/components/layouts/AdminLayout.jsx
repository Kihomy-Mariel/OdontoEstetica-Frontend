import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ADMIN_MENU } from "../../constants/adminMenu";
import logo from "../../assets/logo.png";

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export const AdminLayout = ({ children }) => {
  const usuario = useSelector((store) => store.usuario);
  const navigate = useNavigate();
  const location = useLocation();

  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar fijo y estático */}
      <aside className="flex flex-col items-center bg-white border-r border-blue-100 px-5 py-8 w-[250px] min-w-[250px] h-full shadow-xl sticky top-0 z-20 flex-shrink-0 overflow-y-auto">

        {/* Logo con animación */}
        <div className="flex flex-col items-center mb-7 group">
          <img
            src={logo}
            alt="Odonto Estética Logo"
            className="w-16 h-16 rounded-2xl border-4 border-blue-200 bg-white object-contain shadow transition-transform duration-200 group-hover:scale-110"
            onError={(e) => (e.target.src = perfilDefault)}
          />
          <span className="text-2xl font-bold text-blue-700 mt-2 tracking-tight select-none">
            Odonto<span className="text-blue-400">Estética</span>
          </span>
        </div>

        {/* Perfil */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={perfilDefault}
            alt="Perfil"
            className="w-20 h-20 rounded-full border-2 border-blue-300 object-cover mb-1"
          />
          <span className="font-semibold text-blue-700 text-base text-center">{nombreCompleto}</span>
          <span className="text-xs text-blue-500 font-medium">{usuario.rol}</span>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 w-full mb-auto">
          {ADMIN_MENU.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "text-blue-800 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 mt-8 rounded-xl bg-gradient-to-r from-blue-200 to-blue-100 text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all shadow border border-blue-100"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido que NO debe empujar el sidebar */}
      <main className="flex-1 h-full overflow-y-auto px-4 md:px-10 py-8 md:py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {children}
      </main>
    </div>
  );
};
