// src/services/auth.service.js
import { axiosConsultorio } from '../utils/configAxios';

export const login = async ({ username, password }) => {
  const { data } = await axiosConsultorio.post("/auth/login", { username, password });
  return {
    token: data.token,
    id: data.id,
    username: data.username,
    rol: data.rol
      ?.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    persona: {
      nombres:          data.persona.nombres,
      apellidoPaterno:  data.persona.apellidoPaterno,
      apellidoMaterno:  data.persona.apellidoMaterno,
      email:            data.persona.email,
      ci:               data.persona.ci,               // <-- AGREGADO
      telefono:         data.persona.telefono,         // <-- AGREGADO
      fechaNacimiento:  data.persona.fechaNacimiento,  // <-- AGREGADO
      fechaRegistro:    data.persona.fechaRegistro,    // <-- AGREGADO
    },
  };
};

export const registerCompletoUsuario = async (payload) => {
  const { data } = await axiosConsultorio.post('/auth/register-paciente', payload);
  return data;
};
