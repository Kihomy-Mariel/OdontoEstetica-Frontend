// src/components/layouts/AdminLayout.jsx
import { LogOut, LayoutDashboard, Users, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./AdminLayout.css";

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export const AdminLayout = ({ children, setVista }) => {
    const usuario = useSelector((store) => store.usuario);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="logo">Odonto Estética</div>
                <img src={perfilDefault} alt="Perfil" className="sidebar-foto" />
                <div className="user-info">
                    <strong>{nombreCompleto}</strong>
                    <p className="rol-label">{usuario.rol}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Cerrar Sesión
                </button>
                <nav className="nav-menu">
                    <button onClick={() => navigate("/inicio-adm")}>
                        <Users size={16} /> Dashboard
                    </button>
                    <button onClick={() => navigate("/empleados")}>
                        <Users size={16} /> Empleados
                    </button>
                    <button onClick={() => navigate("/pacientes")}>
                        <Users size={16} /> Pacientes
                    </button>
                    <button onClick={() => navigate("/turnos")}>
                        <Users size={16} /> Turnos
                    </button>
                    <button onClick={() => navigate("/servicios")}>
                        <Users size={16} /> Servicios
                    </button>

                    <button onClick={() => navigate("/pagos")}>
                        <Users size={16} /> Pagos
                    </button>

                    <button onClick={() => navigate("/recibos")}>
                        <Users size={16} /> Recibos
                    </button>

                    <button onClick={() => navigate("/citas")}>
                        <Users size={16} /> Citas
                    </button>

                    <button onClick={() => navigate("/productos")}>
                        <Users size={16} /> Inventario
                    </button>
                </nav>
            </aside>
            <main className="main-content">{children}</main>
        </div>
    );
};