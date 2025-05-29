// src/pages/adm/DashboardAdmPage.jsx
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../services/empleado.service";
import { getAllPacientes } from "../../services/paciente.service";
import { LayoutDashboard, Users, User, Calendar } from "lucide-react";
import "./DashboardAdmPage.css";

export const DashboardAdmPage = () => {
    const usuario = useSelector((store) => store.usuario);
    const [empleados, setEmpleados] = useState([]);
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setEmpleados(await getAllEmpleados());
                setPacientes(await getAllPacientes());
            } catch (err) {
                // Puedes agregar una alerta si lo deseas
            }
        };
        fetchData();
    }, []);

    const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

    return (
        <div className="dashboard-adm">
            <h2 className="section-title">Bienvenido, Administrador</h2>
            <div className="dashboard-grid">
                <StatBox title="Citas Hoy" value="12" icon={<Calendar size={18} />} />
                <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={18} />} />
                <StatBox title="Servicios" value="24" icon={<LayoutDashboard size={18} />} />
                <StatBox title="Empleados Activos" value={empleados.length} icon={<Users size={18} />} />
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
