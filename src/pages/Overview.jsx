import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, TriangleAlert, Target } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getOverview } from '../api/client.js'
import {
  formatValue,
  pctChange,
  formatSignedPct,
  formatRelativeTime,
} from '../lib/format.js'

const SEVERITY_TONE = { high: 'danger', medium: 'warning', low: 'info', positive: 'success' }

function KpiCard({ kpi }) {
  const change = pctChange(kpi.value, kpi.previousValue)
  const up = change >= 0
  const towardTarget = (kpi.value / kpi.target) * 100

  return (
    <Card className={kpi.isHeadline ? 'ring-1 ring-brand-200' : ''}>
      <CardBody>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
          {kpi.isHeadline && <Badge tone="brand">Headline</Badge>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            {formatValue(kpi.value, kpi.unit)}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              up ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {up ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {formatSignedPct(change)}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{kpi.description}</p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Target className="h-3 w-3" /> Target {formatValue(kpi.target, kpi.unit)}
            </span>
            <span>{Math.min(100, Math.round(towardTarget))}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${Math.min(100, towardTarget)}%` }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-card">
      <div className="font-medium text-slate-900">{label}</div>
      <div className="text-slate-500">Activation {payload[0].value}%</div>
    </div>
  )
}

export default function Overview() {
  const { data, loading, error } = useAsync(getOverview)

  if (loading) return <Spinner label="Loading overview…" />
  if (error)
    return <p className="text-sm text-rose-600">Couldn’t load overview: {error.message}</p>

  const { kpis, headlineTrend, anomalies } = data
  const headline = kpis.find((k) => k.isHeadline)
  // Mark the anomalous week on the trend chart.
  const anomalyWeek = anomalies.find((a) => a.severity === 'high')?.week
  const anomalyPoint = headlineTrend.find((p) => p.week === anomalyWeek)

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Activation Rate — week over week"
            subtitle="Headline metric, last 10 weeks"
            action={<Badge tone="brand">{headline.label}</Badge>}
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={headlineTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3A10E5" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#3A10E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEAE1" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: '#A89F90' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#A89F90' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 3', 'dataMax + 3']}
                  />
                  <Tooltip content={<TrendTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3A10E5"
                    strokeWidth={2.5}
                    fill="url(#fill)"
                  />
                  {anomalyPoint && (
                    <ReferenceDot
                      x={anomalyPoint.week}
                      y={anomalyPoint.value}
                      r={5}
                      fill="#f43f5e"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              Red marker = anomaly the agent flagged ({anomalyWeek})
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Anomalies"
            subtitle="Flagged week over week"
            action={<Badge tone="danger">{anomalies.length}</Badge>}
          />
          <CardBody className="space-y-3">
            {anomalies.map((a) => {
              const down = a.direction === 'down'
              return (
                <div
                  key={a.id}
                  className="rounded-lg border border-slate-200 p-3 transition-colors hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{a.metric}</span>
                    <Badge tone={SEVERITY_TONE[a.severity]}>
                      <TriangleAlert className="h-3 w-3" />
                      {a.severity}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-0.5 font-medium ${
                        down ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {down ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                      {formatSignedPct(a.deltaPct)}
                    </span>
                    <span className="text-slate-400">· {a.week}</span>
                    <span className="text-slate-400">· {formatRelativeTime(a.detectedAt)}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{a.summary}</p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Suspected cause:{' '}
                    <span className="font-medium text-slate-600">{a.suspectedCause}</span>
                  </p>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </section>
    </div>
  )
}
