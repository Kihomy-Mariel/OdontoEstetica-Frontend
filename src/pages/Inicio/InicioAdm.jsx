// src/pages/Inicio/InicioAdm.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../services/empleado.service";
import { getAllPacientes } from "../../services/paciente.service";
import { LogOut, LayoutDashboard, Users, User, Calendar } from "lucide-react";
import "./InicioAdm.css";

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export const InicioAdm = () => {
    const navigate = useNavigate();
    const usuario = useSelector((store) => store.usuario);
    const [empleados, setEmpleados] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [vista, setVista] = useState("dashboard");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empleadosData = await getAllEmpleados();
                setEmpleados(empleadosData);
                const pacientesData = await getAllPacientes();
                setPacientes(pacientesData);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            }
        };
        fetchData();
    }, []);

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
                    <button onClick={() => setVista("dashboard")}>
                        <LayoutDashboard size={16} /> Dashboard
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

                </nav>
            </aside>

            <main className="main-content">
                {vista === "dashboard" && (
                    <>
                        <h2 className="section-title">Bienvenido, Administrador</h2>
                        <div className="dashboard-grid">
                            <StatBox title="Citas Hoy" value="12" icon={<Calendar size={16} />} />
                            <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={16} />} />
                            <StatBox title="Servicios" value="24" icon={<LayoutDashboard size={16} />} />
                            <StatBox title="Empleados Activos" value={empleados.length} icon={<Users size={16} />} />
                        </div>

                        <div className="perfil-dashboard">
                            <div>
                                <h3>{nombreCompleto}</h3>
                                <p>Rol: {usuario.rol}</p>
                                <p>Usuario: {usuario.username}</p>
                                <p>Correo: {usuario.email}</p>
                            </div>
                        </div>

                        <div className="citas-hoy-box">
                            <h3>Citas del Día</h3>
                            <p className="text-muted">(Listado de citas aquí...)</p>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
};

const StatBox = ({ title, value, icon }) => (
    <div className="box">
        <div className="stat-header">
            <h4>{title}</h4>
            {icon}
        </div>
        <div className="stat-value">{value}</div>
    </div>
);
