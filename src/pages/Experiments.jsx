import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Beaker, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { Card, CardBody } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getExperiments } from '../api/client.js'
import { formatSignedPct, formatDate } from '../lib/format.js'

const RESULT_META = {
  win: { tone: 'success', label: 'Win', icon: CheckCircle2 },
  loss: { tone: 'danger', label: 'Loss', icon: XCircle },
  flat: { tone: 'neutral', label: 'Flat', icon: MinusCircle },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'running', label: 'Running' },
  { key: 'completed', label: 'Completed' },
]

function ExperimentRow({ exp }) {
  const up = exp.lift >= 0
  const result = exp.result ? RESULT_META[exp.result] : null
  const ResultIcon = result?.icon

  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0 hover:bg-slate-50/60">
      <div className="col-span-12 md:col-span-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400">{exp.id}</span>
          {exp.status === 'running' ? (
            <Badge tone="info">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" /> Running
            </Badge>
          ) : (
            result && (
              <Badge tone={result.tone}>
                <ResultIcon className="h-3 w-3" />
                {result.label}
              </Badge>
            )
          )}
        </div>
        <div className="mt-1 text-sm font-medium text-slate-900">{exp.name}</div>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{exp.hypothesis}</p>
      </div>

      <div className="col-span-4 md:col-span-2">
        <div className="text-[11px] text-slate-400">Metric</div>
        <div className="text-sm text-slate-700">{exp.metric}</div>
      </div>

      <div className="col-span-4 md:col-span-2">
        <div className="text-[11px] text-slate-400">Lift</div>
        <div
          className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
            up ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {formatSignedPct(exp.lift)}
        </div>
        <div className="text-[11px] text-slate-400">
          {Math.round(exp.confidence * 100)}% conf.
        </div>
      </div>

      <div className="col-span-4 md:col-span-3">
        <div className="flex items-center gap-2">
          <Avatar name={exp.owner} color="#64748b" size={24} />
          <div>
            <div className="text-xs font-medium text-slate-700">{exp.owner}</div>
            <div className="text-[11px] text-slate-400">
              {formatDate(exp.startDate)}
              {exp.endDate ? ` → ${formatDate(exp.endDate)}` : ' → now'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experiments() {
  const { data, loading, error } = useAsync(getExperiments)
  const [filter, setFilter] = useState('all')

  if (loading) return <Spinner label="Loading experiments…" />
  if (error)
    return <p className="text-sm text-rose-600">Couldn’t load experiments: {error.message}</p>

  const running = data.filter((e) => e.status === 'running').length
  const wins = data.filter((e) => e.result === 'win').length
  const shown = data.filter((e) => filter === 'all' || e.status === filter)

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Beaker className="h-4 w-4" /> Total
            </div>
            <div className="mt-1 text-2xl font-semibold">{data.length}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-slate-500">Running</div>
            <div className="mt-1 text-2xl font-semibold text-sky-600">{running}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-slate-500">Wins shipped</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-600">{wins}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-slate-500">Win rate</div>
            <div className="mt-1 text-2xl font-semibold">
              {Math.round((wins / data.filter((e) => e.status === 'completed').length) * 100)}%
            </div>
          </CardBody>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between px-5 pt-4">
          <h3 className="text-sm font-semibold text-slate-900">All experiments</h3>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          {shown.map((exp) => (
            <ExperimentRow key={exp.id} exp={exp} />
          ))}
        </div>
      </Card>
    </div>
  )
}
