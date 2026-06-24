import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'
import Avatar from './ui/Avatar.jsx'

const TITLES = {
  '/': { title: 'Overview', subtitle: 'KPIs, trends, and flagged anomalies' },
  '/experiments': {
    title: 'Experiments',
    subtitle: 'What you’re testing and how it’s performing',
  },
  '/strategy': {
    title: 'Strategy',
    subtitle: 'Pillars and the hypotheses behind them',
  },
  '/conversations': {
    title: 'Conversations',
    subtitle: 'Agent chat, Google Meet feed, and meeting notes',
  },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const meta = TITLES[pathname] ?? TITLES['/']

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-5 backdrop-blur">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{meta.title}</h1>
        <p className="text-xs text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          <span>Search metrics, experiments…</span>
        </div>
        <button
          className="relative rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 py-1 pl-1 pr-2 hover:bg-slate-50">
          <Avatar name="Aishwarya R." color="#0E7C7B" size={28} />
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  )
}
