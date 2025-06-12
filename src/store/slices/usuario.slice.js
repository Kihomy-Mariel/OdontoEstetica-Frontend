import { createSlice } from "@reduxjs/toolkit";
import { login, registerCompletoUsuario } from "../../services/auth.service";

// Estado inicial (intenta leer desde localStorage)
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
      loading: false,
      error: null,
      success: false,  // <- puedes usar para feedback de éxito
    };

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    // Almacena los datos tras login
    loginSlice: (state, action) => {
      const data = {
        nombre: action.payload.persona?.nombres || "",
        apellidoPaterno: action.payload.persona?.apellidoPaterno || "",
        apellidoMaterno: action.payload.persona?.apellidoMaterno || "",
        email: action.payload.persona?.email || "",
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
      state.success = false;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false;
    }
  },
});

export const {
  loginSlice,
  cerrarSesion,
  registerStart,
  registerSuccess,
  registerFailure,
  resetSuccess,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;

// Thunk para login
export const loginThunk = (data, navigate) => async (dispatch) => {
  try {
    const response = await login(data);
    dispatch(loginSlice(response));
    navigate("/inicio");
  } catch (err) {
    throw err;
  }
};

// Thunk para registro de paciente
export const registerCompletoThunk = (payload, navigate) => async (dispatch) => {
  dispatch(registerStart());
  try {
    await registerCompletoUsuario(payload);
    dispatch(registerSuccess());
    // Puedes redirigir a login y mostrar un mensaje
    navigate('/', { state: { registered: true } });  
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al registrar paciente';
    dispatch(registerFailure(msg));
  }
};
