import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Beaker,
  CheckCircle2,
  XCircle,
  MinusCircle,
  CalendarClock,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react'
import { Card, CardBody } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Modal from '../components/ui/Modal.jsx'
import ExperimentDetail from '../components/ExperimentDetail.jsx'
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
  { key: 'planned', label: 'Planned' },
  { key: 'running', label: 'Running' },
  { key: 'completed', label: 'Completed' },
]

function StatusBadge({ exp }) {
  if (exp.status === 'planned')
    return (
      <Badge tone="warning">
        <CalendarClock className="h-3 w-3" /> Planned
      </Badge>
    )
  if (exp.status === 'running')
    return (
      <Badge tone="info">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" /> Running
      </Badge>
    )
  const result = RESULT_META[exp.result]
  const Icon = result?.icon
  return (
    result && (
      <Badge tone={result.tone}>
        <Icon className="h-3 w-3" />
        {result.label}
      </Badge>
    )
  )
}

function ExperimentRow({ exp, onOpen }) {
  const planned = exp.status === 'planned'
  const up = exp.lift >= 0

  return (
    <button
      onClick={() => onOpen(exp)}
      className="grid w-full grid-cols-12 items-center gap-3 border-b border-slate-100 px-5 py-4 text-left last:border-0 hover:bg-slate-50/60"
    >
      <div className="col-span-12 md:col-span-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400">{exp.id}</span>
          <StatusBadge exp={exp} />
          {exp.mock && (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-600">
              <ImageIcon className="h-3 w-3" /> UI mock
            </span>
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
        <div className="text-[11px] text-slate-400">{planned ? 'Projected' : 'Lift'}</div>
        {planned ? (
          <div className="text-sm font-semibold text-slate-500">+{exp.expectedLift}%</div>
        ) : (
          <>
            <div
              className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
                up ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {formatSignedPct(exp.lift)}
            </div>
            <div className="text-[11px] text-slate-400">{Math.round(exp.confidence * 100)}% conf.</div>
          </>
        )}
      </div>

      <div className="col-span-3 md:col-span-2">
        <div className="flex items-center gap-2">
          <Avatar name={exp.owner} color="#78716C" size={24} />
          <div>
            <div className="text-xs font-medium text-slate-700">{exp.owner}</div>
            <div className="text-[11px] text-slate-400">
              {planned
                ? `Starts ${formatDate(exp.plannedStart)}`
                : `${formatDate(exp.startDate)}${exp.endDate ? ` → ${formatDate(exp.endDate)}` : ' → now'}`}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 hidden justify-end text-slate-300 md:flex">
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  )
}

export default function Experiments() {
  const { data, loading, error } = useAsync(getExperiments)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  if (loading) return <Spinner label="Loading experiments…" />
  if (error)
    return <p className="text-sm text-rose-600">Couldn’t load experiments: {error.message}</p>

  const planned = data.filter((e) => e.status === 'planned').length
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
            <div className="text-xs text-slate-500">Planned</div>
            <div className="mt-1 text-2xl font-semibold text-amber-600">{planned}</div>
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
            <ExperimentRow key={exp.id} exp={exp} onOpen={setSelected} />
          ))}
        </div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected ? `${selected.id} · ${selected.metric}` : ''}
        maxWidth="max-w-3xl"
      >
        {selected && <ExperimentDetail exp={selected} />}
      </Modal>
    </div>
  )
}
