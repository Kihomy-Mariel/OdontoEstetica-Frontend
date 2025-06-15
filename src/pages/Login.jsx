import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "../store/slices/usuario.slice";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";

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
    setError(null);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center p-8 relative animate-fade-in-up">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Odonto Estética"
            className="w-20 h-20 rounded-2xl border-4 border-blue-200 object-contain shadow-md bg-white mb-2 transition-transform duration-200 hover:scale-105"
          />
          <h1 className="text-3xl font-bold text-blue-700 mb-0.5 tracking-tight drop-shadow">
            Odonto<span className="text-blue-400">Estética</span>
          </h1>
          <p className="text-blue-500 font-medium text-base mt-1">
            Iniciar sesión en el sistema
          </p>
        </div>

        {/* Formulario */}
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm mb-3 text-center">
              {error}
            </div>
          )}

          {/* Usuario */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-[1.08rem] font-bold mb-2"
              style={{
                color: "#183366",
                letterSpacing: ".01em",
                fontFamily: "Segoe UI, Arial, sans-serif"
              }}
            >
              Nombre de usuario
            </label>
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 focus-within:border-blue-400 transition shadow-sm">
              <FaUser className="text-blue-400 text-xl mr-2" />
              <input
                id="username"
                type="text"
                className="w-full py-1 bg-transparent border-none outline-none focus:ring-0 text-blue-900 font-medium placeholder-blue-300 text-base"
                placeholder="ejemplo_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
                style={{ fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-[1.08rem] font-bold mb-2"
              style={{
                color: "#183366",
                letterSpacing: ".01em",
                fontFamily: "Segoe UI, Arial, sans-serif"
              }}
            >
              Contraseña
            </label>
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 focus-within:border-blue-400 transition shadow-sm relative">
              <FaLock className="text-blue-400 text-xl mr-2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full py-1 bg-transparent border-none outline-none focus:ring-0 text-blue-900 font-medium placeholder-blue-300 text-base"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ fontFamily: "inherit" }}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition"
                style={{ fontSize: "1.35rem" }}
                onClick={() => setShow((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Olvidó contraseña */}
          <div className="flex justify-end mt-2 mb-6">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-700 text-sm font-semibold transition underline underline-offset-2"
            >
              ¿Olvidó su contraseña?
            </a>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2.5 rounded-xl shadow-md text-lg transition mb-1"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-3 text-center text-blue-600 text-[15px]">
          ¿No tiene una cuenta?{" "}
          <Link
            to="/register"
            className="font-extrabold text-blue-700 underline hover:text-blue-900 transition"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};
