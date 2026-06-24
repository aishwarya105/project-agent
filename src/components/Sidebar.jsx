import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Compass,
  MessagesSquare,
  Sparkles,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
  { to: '/strategy', label: 'Strategy', icon: Compass },
  { to: '/conversations', label: 'Conversations', icon: MessagesSquare },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">Agenda</div>
          <div className="text-[11px] text-slate-500">Product Command Center</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-medium text-slate-700">Demo data</p>
          <p className="mt-1">
            All metrics are mock. Wire up real APIs in{' '}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-[10px]">
              src/api/client.js
            </code>
            .
          </p>
        </div>
      </div>
    </aside>
  )
}
