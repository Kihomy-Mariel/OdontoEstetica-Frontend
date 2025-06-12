// src/pages/Inicio/InicioAdm.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEmpleados } from "../../services/empleado.service";
import { getAllPacientes } from "../../services/paciente.service";
import { getAllServicios } from "../../services/servicio.service";
import { getPersonaById } from "../../services/persona.service";
import { LogOut, LayoutDashboard, Users, User, Calendar } from "lucide-react";
import "./InicioAdm.css";
import { AdminLayout } from "../../components/layouts/AdminLayout";

const perfilDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export const InicioAdm = () => {
    const usuario = useSelector((store) => store.usuario);
    const [empleados, setEmpleados] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setEmpleados(await getAllEmpleados());
                setPacientes(await getAllPacientes());
                setServicios(await getAllServicios());
                if (usuario?.idPersona) {
                    const personaData = await getPersonaById(usuario.idPersona);
                    setPersona(personaData);
                }
            } catch (err) {
                // puedes manejar errores aquí
            }
        };
        fetchData();
    }, [usuario]);

    const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

    return (
        <AdminLayout>
            <div className="dashboard-adm">
                <h2 className="section-title">Bienvenido, Administrador</h2>
                <div className="dashboard-grid">
                    <StatBox title="Citas Hoy" value="12" icon={<Calendar size={18} />} onClick={() => navigate("/citas")} />
                    <StatBox title="Pacientes Activos" value={pacientes.length} icon={<User size={18} />} onClick={() => navigate("/pacientes")} />
                    <StatBox title="Servicios" value={servicios.length} icon={<User size={18} />} onClick={() => navigate("/servicios")} />
                    <StatBox title="Empleados Activos" value={empleados.length} icon={<Users size={18} />} onClick={() => navigate("/empleados")} />

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
        </AdminLayout>
    );
};

const StatBox = ({ title, value, icon, onClick }) => (
    <div className="box" onClick={onClick} tabIndex={0} role="button">
        <div className="stat-header">
            <h4>{title}</h4>
            {icon}
        </div>
        <div className="stat-value">{value}</div>
    </div>
);
