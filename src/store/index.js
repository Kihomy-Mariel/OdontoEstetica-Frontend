import { configureStore } from "@reduxjs/toolkit";
import usuarioSlice from "./slices/usuario.slice";
// Agrega aquí otros slices cuando los tengas:
import sidebarRoutesSlice from "./slices/sidebarRoutes.slice";  
//import notificationsReducer from "./slices/notificacions.slice";

const store = configureStore({
  reducer: {
    usuario: usuarioSlice,
    sidebarRoutes: sidebarRoutesSlice,
  //  notifications: notificationsReducer
  },
});

export default store;
