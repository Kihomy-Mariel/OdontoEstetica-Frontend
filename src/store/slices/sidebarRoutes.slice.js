// src/store/slices/sidebarRoutes.slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const sidebarRoutesSlice = createSlice({
  name: "sidebarRoutes",
  initialState,
  reducers: {
    setSidebarRoutes: (state, action) => {
      return action.payload;
    }
  }
});

export const { setSidebarRoutes } = sidebarRoutesSlice.actions;
export default sidebarRoutesSlice.reducer;
