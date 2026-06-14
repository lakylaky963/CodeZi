import Icon from '../components/Icon.jsx'

const stack = [
  {
    title: 'React + Vite frontend',
    text: 'Fast development server, optimized production bundles, and route-level views inside client/src.',
    icon: 'code',
  },
  {
    title: 'Express API layer',
    text: 'The client calls import.meta.env.VITE_SERVER_URL, keeping local and deployed backends configurable.',
    icon: 'layers',
  },
  {
    title: 'MongoDB persistence',
    text: 'User records power the CRUD dashboard and the Memory Grid scoreboard without changing the API client.',
    icon: 'database',
  },
  {
    title: 'Deployment ready',
    text: 'Designed for Vercel frontend hosting and Render backend hosting with environment-driven configuration.',
    icon: 'spark',
  },
]

const flow = [
  'User action in React route',
  'API service in client/src/api/user.js',
  'Express route under /api/user',
  'Mongoose model writes MongoDB',
  'UI refreshes local state',
]

export default function TechShowcase() {
  return (
    <section className="page tech-page">
      <div className="tech-hero">
        <div>
          <h1>MERN architecture, presented like a product system.</h1>
          <p>
            This frontend keeps your existing backend contract intact while
            making the app feel cohesive across landing, game, dashboard,
            resume, and technical documentation surfaces.
    <section className="space-y-16 animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">System Architecture</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            A cohesive <span className="text-indigo-500">MERN</span> stack, built for scale.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            This frontend architecture keeps your backend contract intact while 
            unifying the user experience across landing, gaming, and management surfaces.
          </p>
        </div>
        <div className="architecture-card">
          <div className="node react">React</div>
          <div className="connector" />
          <div className="node express">Express</div>
          <div className="connector" />
          <div className="node mongo">MongoDB</div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-around relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Icon name="spark" size={32} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">React</span>
          </div>
          <div className="h-px w-12 bg-slate-800 hidden sm:block" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Icon name="layers" size={32} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Express</span>
          </div>
          <div className="h-px w-12 bg-slate-800 hidden sm:block" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Icon name="database" size={32} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MongoDB</span>
          </div>
        </div>
      </div>

      <div className="stack-grid">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stack.map((item) => (
          <article className="stack-card" key={item.title}>
            <span className="card-icon"><Icon name={item.icon} /></span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          <article key={item.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-colors space-y-4 group">
            <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
              <Icon name={item.icon} size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">{item.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="tech-panels">
        <section className="flow-panel">
          <h2>Request lifecycle</h2>
          <div className="flow-list">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Icon name="spark" className="text-indigo-500" size={20} />
            Request Lifecycle
          </h2>
          <div className="space-y-4">
            {flow.map((step, index) => (
              <div className="flow-step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              <div key={step} className="flex items-center gap-4 group">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  {index + 1}
                </span>
                <p className="text-slate-300 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>
        </div>

        <section className="deployment-panel">
          <h2>Deployment map</h2>
          <div className="deploy-row">
            <strong>Vercel</strong>
            <span>Builds and serves the Vite frontend from client/.</span>
        <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 space-y-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Icon name="layers" className="text-indigo-500" size={20} />
            Deployment Map
          </h2>
          <div className="space-y-6">
            {[
              ['Vercel', 'Builds and serves the Vite frontend from client/.'],
              ['Render', 'Runs the Express server and exposes /api/user.'],
              ['Environment', 'Configuration via VITE_SERVER_URL endpoints.'],
              ['State', 'React state for UI; MongoDB as source of truth.']
            ].map(([platform, desc]) => (
              <div key={platform} className="flex justify-between items-start gap-4 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                <div className="font-bold text-white">{platform}</div>
                <div className="text-right text-sm text-slate-400 max-w-[240px]">{desc}</div>
              </div>
            ))}
          </div>
          <div className="deploy-row">
            <strong>Render</strong>
            <span>Runs the Express server and exposes the /api/user endpoints.</span>
          </div>
          <div className="deploy-row">
            <strong>Environment</strong>
            <span>VITE_SERVER_URL points frontend requests at the active backend.</span>
          </div>
          <div className="deploy-row">
            <strong>State</strong>
            <span>React state handles UI feedback; MongoDB remains the source of truth.</span>
          </div>
        </section>
        </div>
      </div>
    </section>
  )
}
