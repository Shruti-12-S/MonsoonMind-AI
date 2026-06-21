import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { History, LayoutDashboard, LogOut, Sprout, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-field-600 text-white shadow-lg shadow-field-600/20"
      : "text-slate-700 hover:bg-white/80"
  }`;

const AppShell = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/40">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-field-600 text-white shadow-lg shadow-field-600/25">
              <Sprout size={22} />
            </span>
            <div>
              <p className="text-base font-extrabold text-slate-950">
                MonsoonMind
              </p>
              <p className="text-xs font-medium text-slate-500">
                Sowing desk
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard" className={navClass}>
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard size={16} /> Dashboard
              </span>
            </NavLink>
            <NavLink to="/history" className={navClass}>
              <span className="inline-flex items-center gap-2">
                <History size={16} /> Records
              </span>
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} /> Profile
              </span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-right text-sm sm:block">
              <span className="block font-semibold text-slate-900">{user?.name}</span>
              <span className="block text-xs text-slate-500">Farmer</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-red-600"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;