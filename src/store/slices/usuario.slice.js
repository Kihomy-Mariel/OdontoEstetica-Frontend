import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, registerCompletoUsuario } from "../../services/auth.service";

// Utilidad: formato de rol
const formatRol = (rol) =>
  rol?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

// Utilidad: mapear los datos del usuario desde la respuesta
const mapUserData = (payload) => {
  const persona = payload.persona || {};
  return {
    idPersona: persona.idPersona,
    nombre: persona.nombres || "",
    apellidoPaterno: persona.apellidoPaterno || "",
    apellidoMaterno: persona.apellidoMaterno || "",
    email: persona.email || "",
    ci: persona.ci || "",
    fechaNacimiento: persona.fechaNacimiento || "",
    telefono: persona.telefono || "",
    fechaRegistro: persona.fechaRegistro || "",
    token: payload.token || "",
    rol: formatRol(payload.rol),
    id: payload.id || "",
    username: payload.username || "",
  };
};

// Estado base por defecto
const defaultState = {
  idPersona: "",
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  email: "",
  token: "",
  rol: "",
  id: "",
  username: "",
  ci: "",
  fechaNacimiento: "",
  telefono: "",
  fechaRegistro: "",
  loading: false,
  error: null,
  success: false,
};

// Estado inicial con persistencia
const initialState = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : defaultState;

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    setUser(state, action) {
      const userData = mapUserData(action.payload);
      const newState = { ...state, ...userData };
      localStorage.setItem("userInfo", JSON.stringify(newState));
      return newState;
    },
    cerrarSesion() {
      localStorage.removeItem("userInfo");
      return { ...defaultState };
    },
    registerStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    registerSuccess(state) {
      state.loading = false;
      state.success = true;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess(state) {
      state.success = false;
    },
  },
});

export const {
  setUser,
  cerrarSesion,
  registerStart,
  registerSuccess,
  registerFailure,
  resetSuccess,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;

// Thunk para login
export const loginThunk = createAsyncThunk(
  "usuario/loginThunk",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await login(data);
      dispatch(setUser(response));
      return response;
    } catch (err) {
      const msg = err?.response?.data?.message || "Error inesperado";
      return rejectWithValue(msg);
    }
  }
);

// Thunk para registro completo
export const registerCompletoThunk = (payload, navigate) => async (dispatch) => {
  dispatch(registerStart());
  try {
    await registerCompletoUsuario(payload);
    dispatch(registerSuccess());
    navigate('/', { state: { registered: true } });
  } catch (err) {
    const msg = err?.response?.data?.message || 'Error al registrar paciente';
    dispatch(registerFailure(msg));
  }
};
