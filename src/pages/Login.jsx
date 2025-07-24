import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "../store/slices/usuario.slice";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.warn("Por favor complete ambos campos.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(loginThunk({ username, password })).unwrap();
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/inicio");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 flex flex-col items-center animate-fade-in-up">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Odonto Estética"
            className="w-20 h-20 rounded-2xl border-4 border-blue-200 object-contain shadow-md bg-white mb-2 transition-transform duration-200 hover:scale-105"
          />
          <h1 className="text-3xl font-bold text-blue-700 drop-shadow tracking-tight">
            Odonto<span className="text-blue-400">Estética</span>
          </h1>
          <p className="text-blue-500 font-medium text-base mt-1">
            Iniciar sesión en el sistema
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-5" autoComplete="off">
          {/* Usuario */}
          <div>
            <label
              htmlFor="username"
              className="block text-[1.08rem] font-bold mb-2 text-[#183366] tracking-tight font-sans"
            >
              Nombre de usuario
            </label>
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 shadow-sm focus-within:border-blue-400 transition">
              <FaUser className="text-blue-400 text-xl mr-2" />
              <input
                id="username"
                type="text"
                placeholder="Ingrese su Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-1 bg-transparent border-none outline-none text-blue-900 font-medium placeholder-blue-300 text-base"
                required
                autoFocus
                autoComplete="username"
              />

            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-[1.08rem] font-bold mb-2 text-[#183366] tracking-tight font-sans"
            >
              Contraseña
            </label>
            <div className="relative flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 shadow-sm focus-within:border-blue-400 transition">
              <FaLock className="text-blue-400 text-xl mr-2" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-1 bg-transparent border-none outline-none text-blue-900 font-medium placeholder-blue-300 text-base"
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition text-xl"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Enlace: Olvidó contraseña */}
          <div className="flex justify-end -mt-2">
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
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2.5 rounded-xl shadow-md text-lg transition"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Cargando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Enlace: Registro */}
        <p className="mt-4 text-center text-blue-600 text-[15px]">
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
