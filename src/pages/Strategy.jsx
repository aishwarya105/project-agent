import { Target, Lightbulb, CheckCircle2, FlaskConical, XCircle } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getStrategy } from '../api/client.js'

const HEALTH = {
  on_track: { tone: 'success', label: 'On track' },
  at_risk: { tone: 'warning', label: 'At risk' },
  off_track: { tone: 'danger', label: 'Off track' },
}

const HYP_STATUS = {
  validated: { tone: 'success', label: 'Validated', icon: CheckCircle2 },
  testing: { tone: 'info', label: 'Testing', icon: FlaskConical },
  rejected: { tone: 'danger', label: 'Rejected', icon: XCircle },
}

const CONFIDENCE_TONE = { high: 'success', medium: 'warning', low: 'neutral' }

function PillarCard({ pillar }) {
  const health = HEALTH[pillar.health]
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Target className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-900">{pillar.name}</span>
          </div>
          <Badge tone={health.tone}>{health.label}</Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">{pillar.goal}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Progress</span>
            <span>{Math.round(pillar.progress * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                pillar.health === 'at_risk' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${pillar.progress * 100}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
          <Avatar name={pillar.owner} color="#64748b" size={22} />
          <span className="text-xs text-slate-500">Owned by {pillar.owner}</span>
        </div>
      </CardBody>
    </Card>
  )
}

function HypothesisRow({ hyp }) {
  const status = HYP_STATUS[hyp.status]
  const StatusIcon = status.icon
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Lightbulb className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{hyp.statement}</p>
        <p className="mt-1 text-xs text-slate-500">{hyp.evidence}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone={status.tone}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
          <Badge tone={CONFIDENCE_TONE[hyp.confidence]}>{hyp.confidence} confidence</Badge>
          <Badge tone="neutral">{hyp.pillar}</Badge>
        </div>
      </div>
    </div>
  )
}

export default function Strategy() {
  const { data, loading, error } = useAsync(getStrategy)

  if (loading) return <Spinner label="Loading strategy…" />
  if (error)
    return <p className="text-sm text-rose-600">Couldn’t load strategy: {error.message}</p>

  const { strategy, hypotheses } = data

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
              Mission · {strategy.quarter}
            </span>
          </div>
          <p className="mt-2 text-lg font-medium leading-snug text-slate-900">
            {strategy.mission}
          </p>
        </CardBody>
      </Card>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Strategy pillars</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {strategy.pillars.map((p) => (
            <PillarCard key={p.id} pillar={p} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader
          title="Hypotheses board"
          subtitle="The bets behind the strategy and where each one stands"
        />
        <div className="mt-2">
          {hypotheses.map((h) => (
            <HypothesisRow key={h.id} hyp={h} />
          ))}
        </div>
      </Card>
    </div>
  )
}
