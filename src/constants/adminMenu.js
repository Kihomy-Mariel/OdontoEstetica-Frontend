import {
  LayoutDashboard,
  Stethoscope,
  Users,
  User,
  Calendar,
  CreditCard,
  CalendarDays,
  PackageSearch,
  Smile,
} from "lucide-react";

export const ADMIN_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/inicio-adm" },
  { label: "Usuarios", icon: Users, path: "/usuarios" },
  { label: "Pacientes", icon: User, path: "/pacientes" },
  { label: "Empleados", icon: Stethoscope, path: "/empleados" },
  { label: "Turnos", icon: Calendar, path: "/turnos" },
  { label: "Servicios", icon: Smile, path: "/servicios" },
  { label: "Pagos", icon: CreditCard, path: "/pagos" },
  { label: "Citas", icon: CalendarDays, path: "/citas" },
  { label: "Inventario", icon: PackageSearch, path: "/productos" },
  { label: "Proveedores", icon: PackageSearch, path: "/proveedores" },
  { label: "Compras", icon: PackageSearch, path: "/compras" },
];

