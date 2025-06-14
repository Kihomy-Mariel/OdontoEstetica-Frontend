// src/components/common/ShowAlert.jsx
import clsx from "clsx";

// Tipos: 'success', 'error', 'warning', 'info'
const base = "px-4 py-2 rounded-md border text-center my-2 transition";
const colorMap = {
  success: "bg-green-100 border-green-300 text-green-800",
  error: "bg-red-100 border-red-300 text-red-800",
  warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
  info: "bg-blue-100 border-blue-300 text-blue-800",
};

export const ShowAlert = ({ type = "info", children, className }) => (
  <div className={clsx(base, colorMap[type], className)}>
    {children}
  </div>
);
