import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "../store/slices/usuario.slice";
import "./Login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(loginThunk({ username, password }, navigate));
    } catch (err) {
      const msg = err.response?.data?.message || "Error inesperado";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Cabecera */}
        <div className="card-header">
          <img src="public/logo.png" alt="Odonto Estética" />
          <h1>Odonto Estética</h1>
          <p>Iniciar sesión en el sistema por favor</p>
        </div>

        {/* Cuerpo */}
        <div className="card-body">
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="ejemplo_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-row">
              <div>
                <input
                  type="checkbox"
                  id="show"
                  checked={showPassword}
                  onChange={() => setShow(v => !v)}
                />
                <label htmlFor="show" style={{ marginLeft: 4, fontSize: "0.85rem" }}>
                  Mostrar contraseña
                </label>
              </div>
              <a href="#">¿Olvidó su contraseña?</a>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="footer">
            ¿No tiene una cuenta?{" "}
            <Link to="/register" className="link-register">
              Registrarse
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};
