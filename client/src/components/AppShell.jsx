import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Icon from "./Icon.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/game", label: "Game", icon: "game" },
  { to: "/users", label: "Users", icon: "users" },
  { to: "/resume", label: "Resume", icon: "code" },
  { to: "/tech", label: "Ops", icon: "layers" },
];

export default function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28rem),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/86 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/82">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 transition-transform group-hover:scale-105 group-active:scale-95">
              <Icon name="layers" size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black tracking-tight text-slate-950 dark:text-white">
                MERN Control
              </span>
              <span className="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                React + Vite + MongoDB
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500",
                    isActive
                      ? "bg-cyan-50 text-cyan-700 shadow-sm dark:bg-cyan-400/10 dark:text-cyan-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  ].join(" ")
                }
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:text-cyan-200"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-label="Open navigation"
            >
              <Icon name={mobileOpen ? "x" : "menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors",
                      isActive
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    ].join(" ")
                  }
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
