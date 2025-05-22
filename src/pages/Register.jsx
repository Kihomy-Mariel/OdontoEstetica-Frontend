
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompletoThunk } from '../store/slices/usuario.slice';
import './Register.css';


const rolToId = {
    ODONTOLOGO: 1,
    ASISTENTE: 2,
    PACIENTE: 3,
    AUXILIAR: 4,
};

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.usuario);

    // Estado único para todo el formulario
    const [form, setForm] = useState({
        username: '',
        password: '',
        rol: 'PACIENTE',
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
        empleado: { cargo: '', especialidad: '' },
    });

    const onChange = (section, field) => e => {
        const value = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value;

        setForm(f => {
            // Si viene sección (persona, paciente, empleado), actualizamos anidado:
            if (section) {
                return {
                    ...f,
                    [section]: {
                        ...f[section],
                        [field]: value,
                    },
                };
            }
            // Si no, actualizamos un campo “top‐level” (no debería llegar aquí si usas onTopChange)
            return {
                ...f,
                [field]: value,
            };
        });
    };


    // Handler más sencillo para campos top-level
    const onTopChange = key => e => {
        const value = e.target.value;
        setForm(f => ({
            ...f,
            [key]: value,
        }));
    };
    const handleSubmit = e => {
        e.preventDefault();
        const payload = {
            username: form.username,
            password: form.password,
            habilitado: form.habilitado,
            idRol: rolToId[form.rol],
            persona: form.persona,
            ...(form.rol === 'PACIENTE'
                ? { paciente: form.paciente }
                : { empleado: form.empleado }),
        };
        dispatch(registerCompletoThunk(payload, navigate));
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Crear Cuenta</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {/* USUARIO */}
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={onTopChange('username')}
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={onTopChange('password')}
                        required
                    />

                    <label>Rol</label>
                    <select
                        value={form.rol}
                        onChange={onTopChange('rol')}
                    >
                        <option>PACIENTE</option>
                        <option>ODONTOLOGO</option>
                        <option>ASISTENTE</option>
                        <option>AUXILIAR</option>
                    </select>

                    {/* DATOS DE PERSONA */}
                    <h2>Datos Personales</h2>
                    {['nombres', 'apellidoPaterno', 'apellidoMaterno', 'ci', 'fechaNacimiento', 'telefono', 'email'].map(field => (
                        <React.Fragment key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === 'fechaNacimiento' ? 'date' : 'text'}
                                value={form.persona[field]}
                                onChange={onChange('persona', field)}
                                required
                            />
                        </React.Fragment>
                    ))}

                    {/* DATOS DE PACIENTE O EMPLEADO */}
                    {form.rol === 'PACIENTE' ? (
                        <>
                            <h2>Información de Paciente</h2>
                            <label>Alergias</label>
                            <input
                                type="text"
                                value={form.paciente.alergias}
                                onChange={onChange('paciente', 'alergias')}
                            />
                        </>
                    ) : (
                        <>
                            <h2>Información de Empleado</h2>
                            <label>Cargo</label>
                            <input
                                type="text"
                                value={form.empleado.cargo}
                                onChange={onChange('empleado', 'cargo')}
                                required
                            />
                            <label>Especialidad</label>
                            <input
                                type="text"
                                value={form.empleado.especialidad}
                                onChange={onChange('empleado', 'especialidad')}
                                required
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Registrando…' : 'Registrarse'}
                    </button>
                </form>

                <p>
                    ¿Ya tienes cuenta? <Link to="/">Iniciar Sesión</Link>
                </p>
            </div>
        </div>
    );
};
