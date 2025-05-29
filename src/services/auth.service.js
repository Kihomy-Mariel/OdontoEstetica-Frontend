// src/services/auth.service.js
import { axiosConsultorio } from '../utils/configAxios';

// LOGIN (dejas igual, si el backend lo soporta así)
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
 * Registra un nuevo paciente en el backend.
 * Recibe un objeto con { username, password, habilitado, persona, paciente }
 * y devuelve la respuesta del endpoint POST /auth/register-paciente
 */
export const registerCompletoUsuario = async (payload) => {
  const { data } = await axiosConsultorio.post('/auth/register-paciente', payload);
  return data;
};
