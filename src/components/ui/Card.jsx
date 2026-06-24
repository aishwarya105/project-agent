// Lightweight card primitives used across the dashboard.

// "pop" cards use Codecademy's playful hard-offset shadow + bold border. The
// shadow classes are written out in full (not interpolated) so Tailwind's JIT
// can see them. Used as an accent on KPI/stat cards, not every card.
const POP_VARIANTS = {
  navy: 'border-2 border-slate-900 shadow-[4px_4px_0_0_#14161F] hover:shadow-[6px_6px_0_0_#14161F]',
  brand: 'border-2 border-brand-600 shadow-[4px_4px_0_0_#3A10E5] hover:shadow-[6px_6px_0_0_#3A10E5]',
}

export function Card({ className = '', pop = false, popColor = 'navy', children, ...props }) {
  const base = pop
    ? `rounded-2xl bg-white transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 ${POP_VARIANTS[popColor]}`
    : 'rounded-2xl border border-slate-200 bg-white shadow-card'
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className = '', children }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}
