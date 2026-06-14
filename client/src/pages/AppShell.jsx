import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useTheme } from '../context/ThemeContext'

export default function AppShell({ children }) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Home', icon: 'spark' },
    { to: '/game', label: 'Play', icon: 'game' },
    { to: '/users', label: 'Dashboard', icon: 'users' },
    { to: '/resume', label: 'Resume', icon: 'code' },
    { to: '/tech', label: 'Stack', icon: 'layers' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-400">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Icon name="layers" size={18} />
            </div>
            MERN.v2
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === item.to
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-all text-slate-400 hover:text-indigo-400"
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'spark' : 'database'} size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  )
}