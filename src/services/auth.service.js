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
    },
  };
};

/**
 * Registra un nuevo usuario en el backend.
 * Recibe un objeto con { username, password, rol, habilitado, idRol, personaId? }
 * y devuelve lo que retorne tu endpoint POST /auth/register
 */
// src/services/auth.service.js

export const registerCompleto = async (payload) => {
  // Llama a tu endpoint que maneja usuario+persona+hijo
  const { data } = await axiosConsultorio.post('/auth/register-full', payload);
  return data;
};

