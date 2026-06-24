import { ArrowDownRight, ArrowUpRight, ImageOff } from 'lucide-react'
import Badge from './ui/Badge.jsx'
import Avatar from './ui/Avatar.jsx'
import Wireframe from './Wireframe.jsx'
import { formatSignedPct, formatDate } from '../lib/format.js'

const STATUS_TONE = { running: 'info', planned: 'warning', completed: 'neutral' }

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-slate-800">{children}</div>
    </div>
  )
}

export default function ExperimentDetail({ exp }) {
  const planned = exp.status === 'planned'
  const lift = exp.status === 'completed' || exp.status === 'running' ? exp.lift : null

  return (
    <div className="space-y-5">
      {/* Hypothesis */}
      <div className="rounded-lg bg-slate-50 p-4">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Hypothesis
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{exp.hypothesis}</p>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Status">
          <Badge tone={STATUS_TONE[exp.status]} className="capitalize">
            {exp.status}
          </Badge>
        </Field>
        <Field label="Primary metric">{exp.metric}</Field>
        <Field label="Owner">
          <span className="flex items-center gap-1.5">
            <Avatar name={exp.owner} color="#64748b" size={20} />
            {exp.owner}
          </span>
        </Field>
        <Field label="Audience">{exp.audience}</Field>

        <Field label={planned ? 'Projected lift' : 'Lift'}>
          {planned ? (
            <span className="text-slate-500">+{exp.expectedLift}% (proj.)</span>
          ) : (
            <span
              className={`inline-flex items-center gap-0.5 ${
                lift >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {lift >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {formatSignedPct(lift)}
            </span>
          )}
        </Field>
        {!planned && <Field label="Confidence">{Math.round(exp.confidence * 100)}%</Field>}
        <Field label={planned ? 'Planned start' : 'Started'}>
          {formatDate(planned ? exp.plannedStart : exp.startDate)}
        </Field>
        {exp.endDate && <Field label="Ended">{formatDate(exp.endDate)}</Field>}
      </div>

      {/* UI mock */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">UI mock</h4>
          {exp.mock && (
            <span className="text-[11px] text-slate-400">Control vs. variant</span>
          )}
        </div>
        {exp.mock ? (
          <Wireframe mock={exp.mock} />
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-400">
            <ImageOff className="h-4 w-4" />
            No UI mock attached to this experiment yet.
          </div>
        )}
      </div>
    </div>
  )
}
