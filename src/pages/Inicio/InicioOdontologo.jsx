import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const InicioOdontologo = () => {
  const navigate = useNavigate();
  const usuario = useSelector((store) => store.usuario); // 👈 Accede al usuario actual

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // o tu clave actual
    navigate("/");
  };

  const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

  return (
    <div style={{ backgroundColor: "#f0f6ff", minHeight: "100vh", padding: "20px" }}>
      <header style={{
        backgroundColor: "#ffffff",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd"
      }}>
        <h1 style={{ color: "#1976d2", fontSize: "20px" }}>🦷 Odonto Estética</h1>
        <nav>
          <a style={navLink} href="#">Inicio</a>
          <a style={navLink} href="#">Servicios</a>
          <a style={navLink} href="#">Pacientes</a>
        </nav>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#ccc" }} />
      </header>

      <main style={{ marginTop: "30px", maxWidth: "1000px", marginInline: "auto" }}>
        <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>Mi Perfil</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "#fff", flex: "1", padding: "20px", borderRadius: "10px", minWidth: "250px" }}>
            <div style={{
              width: "100px", height: "100px",
              borderRadius: "50%", backgroundColor: "#ddd",
              margin: "auto"
            }} />
            <h3 style={{ textAlign: "center", marginTop: "10px" }}>{nombreCompleto}</h3>
            <p style={{ textAlign: "center", color: "#666" }}>{usuario.rol}</p>
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button style={buttonBlue}>Editar Perfil</button>
              <button style={buttonRed} onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>

          <div style={{ backgroundColor: "#fff", flex: "2", padding: "20px", borderRadius: "10px", minWidth: "300px" }}>
            <h4 style={{ marginBottom: "15px" }}>Información Personal</h4>
            <div style={infoGrid}>
              <Info label="Nombre Completo" value={nombreCompleto} />
              <Info label="Correo Electrónico" value={usuario.email} />
              <Info label="Usuario" value={usuario.username} />
              <Info label="Rol" value={usuario.rol} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Estilos y componente Info igual que antes
const navLink = {
  marginInline: "10px",
  textDecoration: "none",
  color: "#333"
};

const buttonBlue = {
  padding: "10px",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const buttonRed = {
  ...buttonBlue,
  backgroundColor: "#d32f2f"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px"
};

const Info = ({ label, value }) => (
  <div>
    <strong style={{ display: "block", fontSize: "13px", color: "#555" }}>{label}</strong>
    <span style={{ fontSize: "15px" }}>{value}</span>
  </div>
);
