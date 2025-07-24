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
      idPersona: data.persona.idPersona,   // ✅ aquí
      nombres:         data.persona.nombres,
      apellidoPaterno: data.persona.apellidoPaterno,
      apellidoMaterno: data.persona.apellidoMaterno,
      email:           data.persona.email,
      ci:              data.persona.ci,
      telefono:        data.persona.telefono,
      fechaNacimiento: data.persona.fechaNacimiento,
      fechaRegistro:   data.persona.fechaRegistro,
    },
  };
};


export const registerCompletoUsuario = async (payload) => {
  const { data } = await axiosConsultorio.post('/auth/register-paciente', payload);
  return data;
};
