import Icon from '../components/Icon.jsx'

const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'Python',
  'Docker',
  'SQL',
  'MongoDB',
  'CI/CD',
  'REST APIs',
  'Vite',
]

const experience = [
  {
    role: 'Full-Stack Software Developer',
    company: 'Product Engineering Studio',
    years: '2023 - Present',
    bullets: [
      'Built responsive React interfaces backed by Node.js services and MongoDB data models.',
      'Designed REST API workflows with validation, observability, and deployment readiness.',
      'Improved developer velocity with Vite, reusable UI primitives, and clean project boundaries.',
    ],
  },
  {
    role: 'Backend Developer',
    company: 'Cloud Operations Platform',
    years: '2021 - 2023',
    bullets: [
      'Delivered Python and Node.js services for automation, reporting, and internal tools.',
      'Modeled relational and NoSQL data for operational dashboards and user-facing products.',
      'Containerized services with Docker and supported production deployments.',
    ],
  },
]

export default function Resume() {
  return (
    <section className="grid lg:grid-cols-4 gap-12 animate-in fade-in duration-700">
      <aside className="lg:col-span-1 space-y-10">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/40">SD</div>
          <h1 className="text-3xl font-bold text-white leading-tight">Software Developer</h1>
          <p className="text-slate-400 text-sm leading-relaxed">Crafting production-grade experiences from database schema to interface.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(s => <span key={s} className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-widest">{s}</span>)}
        </div>
      </aside>
      <div className="lg:col-span-3 space-y-12">
        <section className="space-y-6">
          <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Icon name="spark" size={14} /> Professional Summary
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed font-medium">I bridge frontend craft and backend reliability: component systems, API integration, data modeling, and deployment pipelines that teams can scale.</p>
        </section>
        <section className="space-y-8">
          <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Icon name="code" size={14} /> Experience
          </h2>
          <div className="space-y-10">
            {experience.map(exp => (
              <div key={exp.role} className="relative pl-8 border-l border-slate-800">
                <div className="absolute w-3 h-3 rounded-full bg-indigo-500 -left-[6.5px] top-1.5 ring-4 ring-slate-950" />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <span className="text-xs font-mono text-slate-500">{exp.years}</span>
                </div>
                <div className="text-indigo-400 text-sm font-bold mb-4">{exp.company}</div>
                <ul className="space-y-2">
                  {exp.bullets.map(b => <li key={b} className="text-sm text-slate-400 flex items-start gap-2 italic"><span>—</span> {b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
