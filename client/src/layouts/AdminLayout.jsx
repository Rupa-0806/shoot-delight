import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { to: "/admin/bookings", label: "Bookings", icon: HiOutlineCalendar },
  { to: "/admin/services", label: "Services", icon: HiOutlineBriefcase },
  { to: "/admin/packages", label: "Packages", icon: HiOutlineTag },
  { to: "/admin/slots", label: "Slots", icon: HiOutlineClock },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ink flex text-cream">
      <Toaster position="top-center" toastOptions={{ style: { background: "#111", color: "#faf9f6" } }} />

      <aside className="w-64 glass shrink-0 hidden md:flex flex-col p-6">
        <img src="/brand/logo-nav.png" alt="Shoot Delight" className="brand-logo h-10 mb-8" />
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-brand text-ink" : "text-cream/80 hover:bg-cream/10"
                }`
              }
            >
              <Icon className="text-lg" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-cream/10 pt-4">
          <p className="text-sm text-cream/70 mb-2">{admin?.name}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-cream/70 hover:text-brand"
          >
            <HiOutlineLogout /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden glass p-4 flex justify-between items-center">
          <img src="/brand/logo-nav.png" alt="Shoot Delight Admin" className="brand-logo h-8" />
          <button onClick={handleLogout} className="text-sm text-cream/70">Logout</button>
        </header>
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
