// src/store/slices/usuario.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { login, registerCompleto } from "../../services/auth.service";

const initialState = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      token: "",
      rol: "",
      id: "",
      username: "",
      // Estados para registro
      loading: false,
      error: null,
    };

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    // Almacena los datos tras un login exitoso
    loginSlice: (state, action) => {
      const data = {
        nombre: action.payload.persona.nombres,
        apellidoPaterno: action.payload.persona.apellidoPaterno,
        apellidoMaterno: action.payload.persona.apellidoMaterno,
        email: action.payload.persona.email,
        token: action.payload.token,
        rol: action.payload.rol
          ?.toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        id: action.payload.id,
        username: action.payload.username,
      };
      const newState = { ...state, ...data };
      localStorage.setItem("userInfo", JSON.stringify(newState));
      return newState;
    },

    // Limpia el estado al cerrar sesión
    cerrarSesion: () => {
      localStorage.removeItem("userInfo");
      return { ...initialState };
    },

    // --- Reducers para el registro ---
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginSlice,
  cerrarSesion,
  registerStart,
  registerSuccess,
  registerFailure,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;

// Thunk para login (ya lo tenías)
export const loginThunk = (data, navigate) => async (dispatch) => {
  try {
    const response = await login(data);
    dispatch(loginSlice(response));
    navigate("/inicio");
  } catch (err) {
    throw err;
  }
};

// Nuevo thunk para registro
export const registerCompletoThunk = (payload, navigate) => async (dispatch) => {
  dispatch(registerStart());
  try {
    await registerCompleto(payload);
    dispatch(registerSuccess());
    navigate('/');  
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al registrar completo';
    dispatch(registerFailure(msg));
  }
};
