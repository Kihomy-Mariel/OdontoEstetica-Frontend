import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompletoThunk } from '../store/slices/usuario.slice';
import './Register.css';

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.usuario);

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        habilitado: true,
        persona: {
            nombres: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            ci: '',
            fechaNacimiento: '',
            telefono: '',
            email: '',
        },
        paciente: { alergias: '' },
    });

    const onChange = (section, field) => e => {
        const value = e.target.value;
        setForm(f => ({
            ...f,
            [section]: {
                ...f[section],
                [field]: value,
            },
        }));
    };

    const onTopChange = key => e => {
        setForm(f => ({
            ...f,
            [key]: e.target.value,
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert('Las contraseñas no coinciden');
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
        <div className="register-bg">
            <div className="register-center">
                <div className="register-card">
                    <div className="card-header">
                        <img src="public/logo.png" alt="Odonto Estética" />
                        <h1>Odonto Estética</h1>
                        <p>Registro de pacientes</p>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/* DATOS DE USUARIO */}
                        <h2 className="form-section-title">Datos de usuario</h2>
                        <div className="form-grid">
                            <div className="form-col">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    placeholder="Cree un nombre de usuario"
                                    value={form.username}
                                    onChange={onTopChange('username')}
                                    minLength={3}
                                    maxLength={32}
                                    required
                                />
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Cree una contraseña"
                                    value={form.password}
                                    onChange={onTopChange('password')}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <div className="form-col">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Confirme su contraseña"
                                    value={form.confirmPassword}
                                    onChange={onTopChange('confirmPassword')}
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        {/* DATOS PERSONALES */}
                        <h2 className="form-section-title">Datos personales</h2>
                        <div className="form-grid">
                            <div className="form-col">
                                <label>Nombres</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese solo sus nombres"
                                    value={form.persona.nombres}
                                    onChange={onChange('persona', 'nombres')}
                                    required
                                />
                                <label>Apellido Paterno</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su apellido paterno"
                                    value={form.persona.apellidoPaterno}
                                    onChange={onChange('persona', 'apellidoPaterno')}
                                    required
                                />
                                <label>Apellido Materno</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su apellido materno"
                                    value={form.persona.apellidoMaterno}
                                    onChange={onChange('persona', 'apellidoMaterno')}
                                    required
                                />
                            </div>
                            <div className="form-col">
                                <label>Cédula de Identidad</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su cédula de identidad"
                                    value={form.persona.ci}
                                    onChange={onChange('persona', 'ci')}
                                    required
                                />
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="Ingrese su número de teléfono"
                                    value={form.persona.telefono}
                                    onChange={onChange('persona', 'telefono')}
                                    required
                                />
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={form.persona.email}
                                    onChange={onChange('persona', 'email')}
                                    required
                                />
                                <label>Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    placeholder="Seleccione una fecha"
                                    value={form.persona.fechaNacimiento}
                                    onChange={onChange('persona', 'fechaNacimiento')}
                                    required
                                />
                            </div>
                        </div>

                        {/* DATOS PACIENTE */}
                        <h2 className="form-section-title">Datos de paciente</h2>
                        <label>Alergias (opcional)</label>
                        <input
                            type="text"
                            placeholder="Alergias (opcional)"
                            value={form.paciente.alergias}
                            onChange={onChange('paciente', 'alergias')}
                            className="alergias-input"
                        />

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Registrando…' : 'Registrar'}
                        </button>
                    </form>

                    <p className="bottom-link">
                        ¿Ya tiene una cuenta? <Link to="/">Iniciar sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
