import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerCompletoThunk } from "../store/slices/usuario.slice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.usuario);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    habilitado: true,
    persona: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      ci: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
    },
    paciente: { alergias: "" },
  });

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChange = (section, field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [section]: {
        ...f[section],
        [field]: value,
      },
    }));
  };

  const onTopChange = (key) => (e) => {
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const payload = {
      username: form.username,
      password: form.password,
      habilitado: true,
      persona: form.persona,
      paciente: form.paciente,
    };
    dispatch(registerCompletoThunk(payload, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-2 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center px-5 md:px-12 py-8 md:py-10 relative animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center mb-7 w-full">
          <img
            src={logo}
            alt="Odonto Estética"
            className="w-20 h-20 rounded-2xl border-4 border-blue-200 object-contain shadow-md bg-white mb-2 transition-transform duration-200 hover:scale-105"
          />
          <h1 className="text-3xl font-bold text-blue-700 mb-0.5 tracking-tight drop-shadow">
            Odonto<span className="text-blue-400">Estética</span>
          </h1>
          <p className="text-blue-500 font-medium text-base mt-1">
            Registro de pacientes
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm mb-4 text-center w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
          {/* Datos de usuario */}
          <h2 className="text-lg font-semibold text-blue-800 mb-4 border-l-4 border-blue-400 pl-3 bg-blue-50/70 rounded-md py-1">
            Datos de usuario
          </h2>
          <div className="grid md:grid-cols-2 gap-x-7 gap-y-1 mb-5">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Cree un nombre de usuario"
                value={form.username}
                onChange={onTopChange("username")}
                minLength={3}
                maxLength={32}
                required
                className="input"
                autoComplete="new-username"
                spellCheck={false}
              />

              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Cree una contraseña"
                  value={form.password}
                  onChange={onTopChange("password")}
                  minLength={6}
                  required
                  className="input pr-11"
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 text-xl transition"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirme su contraseña"
                  value={form.confirmPassword}
                  onChange={onTopChange("confirmPassword")}
                  minLength={6}
                  required
                  className="input pr-11"
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 text-xl transition"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Datos personales */}
          <h2 className="text-lg font-semibold text-blue-800 mb-4 border-l-4 border-blue-400 pl-3 bg-blue-50/70 rounded-md py-1">
            Datos personales
          </h2>
          <div className="grid md:grid-cols-2 gap-x-7 gap-y-1 mb-5">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Nombres
              </label>
              <input
                type="text"
                placeholder="Ingrese solo sus nombres"
                value={form.persona.nombres}
                onChange={onChange("persona", "nombres")}
                required
                className="input"
              />
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Apellido Paterno
              </label>
              <input
                type="text"
                placeholder="Ingrese su apellido paterno"
                value={form.persona.apellidoPaterno}
                onChange={onChange("persona", "apellidoPaterno")}
                required
                className="input"
              />
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                placeholder="Ingrese su apellido materno"
                value={form.persona.apellidoMaterno}
                onChange={onChange("persona", "apellidoMaterno")}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Cédula de Identidad
              </label>
              <input
                type="text"
                placeholder="Ingrese su cédula de identidad"
                value={form.persona.ci}
                onChange={onChange("persona", "ci")}
                required
                className="input"
              />
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="Ingrese su número de teléfono"
                value={form.persona.telefono}
                onChange={onChange("persona", "telefono")}
                required
                className="input"
              />
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={form.persona.email}
                onChange={onChange("persona", "email")}
                required
                className="input"
              />
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                placeholder="Seleccione una fecha"
                value={form.persona.fechaNacimiento}
                onChange={onChange("persona", "fechaNacimiento")}
                required
                className="input"
              />
            </div>
          </div>

          {/* Datos de paciente */}
          <h2 className="text-lg font-semibold text-blue-800 mb-3 border-l-4 border-blue-400 pl-3 bg-blue-50/70 rounded-md py-1">
            Datos de paciente
          </h2>
          <label className="block text-sm font-semibold text-blue-900 mb-1">
            Alergias <span className="font-normal text-blue-400">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Alergias (opcional)"
            value={form.paciente.alergias}
            onChange={onChange("paciente", "alergias")}
            className="input mb-4"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-md text-lg transition mb-1 mt-2"
            disabled={loading}
          >
            {loading ? "Registrando…" : "Registrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-blue-600 text-[15px]">
          ¿Ya tiene una cuenta?{" "}
          <Link
            to="/"
            className="font-extrabold text-blue-700 underline hover:text-blue-900 transition"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

