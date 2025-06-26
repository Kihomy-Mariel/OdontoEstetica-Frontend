import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllServicios } from "../../services/servicio.service";
import { getCitasByPaciente } from "../../services/cita.service";
import { User, Calendar, Stethoscope, ClipboardList, FileText, Clock, FileArchive } from "lucide-react";
import { PacienteLayout } from "../../components/layouts/PacienteLayout";

export const InicioPaciente = () => {
    const navigate = useNavigate();
    const usuario = useSelector((store) => store.usuario);
    const [servicios, setServicios] = useState([]);
    const [citasProximas, setCitasProximas] = useState([]);

    const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.trim();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setServicios(await getAllServicios());
                if (usuario?.idPersona) {
                    // Obtener citas del paciente
                    const citas = await getCitasByPaciente(usuario.idPersona);
                    setCitasProximas(citas.filter(cita => new Date(cita.fecha) >= new Date()).slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [usuario]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    return (
      <PacienteLayout>
        <div style={{ backgroundColor: "#f0f6ff", minHeight: "100vh", padding: "20px" }}>
          <main style={{
            maxWidth: "1000px",
            marginInline: "auto",
            paddingBottom: "50px"
          }}>
            <h2 style={{
              color: "#1976d2",
              marginBottom: "30px",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center"
            }}>
              ¡Bienvenido, <span style={{ color: "#42a5f5" }}>{usuario.nombre || 'Paciente'}</span>!
            </h2>

            {/* Card de perfil */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#1976d2",
                marginBottom: "20px",
                textAlign: "center"
              }}>{nombreCompleto}</h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px"
              }}>
                <ProfileField label="Rol" value={usuario.rol} />
                <ProfileField label="Usuario" value={usuario.username} />
                <ProfileField label="Correo" value={usuario.email} />
                <ProfileField label="CI" value={usuario.ci} />
                <ProfileField label="Teléfono" value={usuario.telefono} />
                <ProfileField
                  label="Fecha de nacimiento"
                  value={usuario.fechaNacimiento ? formatDate(usuario.fechaNacimiento) : "-"}
                />
              </div>
            </div>

            {/* Citas próximas */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1976d2",
                marginBottom: "20px"
              }}>Próximas Citas</h3>

              {citasProximas.length > 0 ? (
                <div style={{ display: "grid", gap: "15px" }}>
                  {citasProximas.map(cita => (
                    <div key={cita.id} style={{
                      borderBottom: "1px solid #eee",
                      paddingBottom: "15px",
                      marginBottom: "15px",
                      ":last-child": {
                        borderBottom: "none",
                        marginBottom: "0"
                      }
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "5px"
                      }}>
                        <span style={{
                          fontWeight: "500",
                          color: "#1565c0"
                        }}>
                          {formatDate(cita.fecha)} a las {cita.hora}
                        </span>
                        <button
                          onClick={() => navigate(`/citas/${cita.id}`)}
                          style={{
                            color: "#1976d2",
                            fontWeight: "600",
                            fontSize: "14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          Ver detalles
                        </button>
                      </div>
                      <div style={{ color: "#42a5f5", fontSize: "14px" }}>
                        {cita.servicio?.nombre || 'Servicio no especificado'}
                      </div>
                      <div style={{ color: "#90caf9", fontSize: "12px" }}>
                        Dr. {cita.empleado?.nombre || 'Doctor no asignado'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  color: "#90caf9",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "20px 0"
                }}>
                  No tienes citas programadas próximamente.
                </p>
              )}
            </div>
          </main>
        </div>
      </PacienteLayout>
    );
};


// Componente para mostrar cada campo de perfil
const ProfileField = ({ label, value }) => (
    <div style={{ marginBottom: "10px" }}>
        <span style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "#42a5f5",
            marginBottom: "2px"
        }}>{label}</span>
        <span style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#1976d2"
        }}>{value || "-"}</span>
    </div>
);

// Formateador de fecha
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-BO", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

// Estilos constantes
const buttonRed = {
    padding: "10px 15px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500"
};