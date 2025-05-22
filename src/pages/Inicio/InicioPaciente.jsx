// src/pages/Inicio/InicioPaciente.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const InicioPaciente = () => {
  const navigate = useNavigate();
  const usuario = useSelector((store) => store.usuario);
  const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

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
          <a onClick={() => navigate("/inicio-paciente")} style={navLink}>Inicio</a>
          <a onClick={() => navigate("/reservar-cita")} style={navLink}>Reservar Cita</a>
        </nav>
        <button style={buttonRed} onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <main style={{ marginTop: "30px", maxWidth: "1000px", marginInline: "auto" }}>
        <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>¡Bienvenido, {nombreCompleto}!</h2>
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
        }}>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Desde aquí puedes gestionar tus citas. Haz clic en <strong>“Reservar Cita”</strong> para solicitar un nuevo turno con tu odontólogo.
          </p>
        </div>
      </main>
    </div>
  );
};

const navLink = {
  marginInline: "10px",
  textDecoration: "none",
  color: "#333",
  cursor: "pointer",
  fontWeight: 500,
};

const buttonRed = {
  padding: "10px 15px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
