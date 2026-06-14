import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const destinations = [
  {
    to: '/game',
    title: 'Play Memory Grid',
    text: 'A fast browser game with automatic MongoDB score saving.',
    icon: 'game',
  },
  {
    to: '/users',
    title: 'Manage Users',
    text: 'Create, search, update, and delete users through your existing API.',
    icon: 'users',
  },
  {
    to: '/resume',
    title: 'View Resume',
    text: 'A polished developer profile with skills, projects, and experience.',
    icon: 'code',
  },
  {
    to: '/tech',
    title: 'Explore Stack',
    text: 'See how the MERN architecture, Vite, hosting, and state fit together.',
    icon: 'layers',
  },
]

const metrics = [
  ['5', 'Production pages'],
  ['100%', 'Existing API compatible'],
  ['Vite', 'Fast client build'],
]

export default function Home() {
  return (
    <section className="animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            v2.0 Architecture
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Ship polished <span className="text-indigo-500">MERN</span> apps faster.
          </h1>
          <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
            A premium, production-ready interface for your boilerplate. Dashboard workflows, database-backed gaming, and technical showcases built with modern SaaS principles.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/game" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 group">
              Launch Game
              <Icon name="arrow" className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/users" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all border border-slate-700">
              Management Dashboard
            </Link>
          </div>
        </div>

        <div className="relative group lg:block hidden">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            </div>
            <div className="p-8 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 flex flex-col justify-end">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 mb-2 flex items-center justify-center text-indigo-400">
                    <Icon name="database" size={16} />
                  </div>
                  <span className="text-xs font-medium text-indigo-300">Database Sync</span>
                </div>
                <div className="h-40 rounded-2xl bg-slate-800 border border-slate-700"></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-48 rounded-2xl bg-slate-800 border border-slate-700"></div>
                <div className="h-16 rounded-2xl bg-slate-800/50 border border-slate-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-24 py-12 border-y border-slate-800/50">
        {metrics.map(([value, label]) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all mb-6">
              <Icon name={item.icon} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.text}</p>
            <span className="flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:gap-4 transition-all uppercase tracking-widest">
              Explore Module <Icon name="arrow" size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
