import { Image as ImageIcon, Check } from 'lucide-react'
import Badge from './ui/Badge.jsx'

// ---------------------------------------------------------------------------
// Wireframe — a tiny declarative renderer for UI mocks.
//
// A mock is plain data (see `mock` fields in src/api/mockData.js): a device
// frame plus a list of variants, each variant a list of "blocks". This keeps
// experiment mockups inside the same data layer as everything else — no image
// assets to manage. If your design team would rather drop in real screenshots,
// swap the <Block> renderer for an <img src={...} /> keyed off the variant.
// ---------------------------------------------------------------------------

function Bars({ heights = [40, 70, 50, 90, 60, 80] }) {
  return (
    <div className="flex h-12 items-end gap-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-brand-200"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

function SkeletonLines({ lines = 2 }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full bg-slate-200"
          style={{ width: `${90 - i * 18}%` }}
        />
      ))}
    </div>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'header':
      return <div className="text-[13px] font-semibold leading-tight text-slate-900">{block.text}</div>
    case 'subhead':
      return <div className="text-[11px] text-slate-500">{block.text}</div>
    case 'text':
      return <SkeletonLines lines={block.lines ?? 2} />
    case 'progress':
      return (
        <div>
          {block.label && (
            <div className="mb-1 text-[10px] text-slate-400">{block.label}</div>
          )}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${Math.round((block.value ?? 0) * 100)}%` }}
            />
          </div>
        </div>
      )
    case 'list':
      return (
        <div className="space-y-1.5">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300">
                {block.checked?.includes(i) && <Check className="h-2.5 w-2.5 text-emerald-500" />}
              </span>
              {item}
            </div>
          ))}
        </div>
      )
    case 'button':
      return (
        <div
          className={`rounded-md px-3 py-1.5 text-center text-[11px] font-medium ${
            block.variant === 'secondary'
              ? 'border border-slate-300 text-slate-600'
              : 'bg-brand-500 text-white'
          }`}
        >
          {block.text}
        </div>
      )
    case 'input':
      return (
        <div className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-400">
          {block.placeholder}
        </div>
      )
    case 'image':
      return (
        <div className="flex h-16 items-center justify-center rounded-md bg-slate-100 text-slate-300">
          <ImageIcon className="h-5 w-5" />
        </div>
      )
    case 'metric':
      return (
        <div>
          <div className="text-xl font-semibold tracking-tight text-slate-900">{block.value}</div>
          <div className="text-[10px] text-slate-400">{block.label}</div>
        </div>
      )
    case 'bars':
      return <Bars heights={block.heights} />
    case 'callout':
      return (
        <div className="rounded-md bg-brand-50 p-2 ring-1 ring-inset ring-brand-100">
          <div className="text-[11px] font-semibold text-brand-700">{block.title}</div>
          {block.text && <div className="mt-0.5 text-[10px] text-brand-600/80">{block.text}</div>}
        </div>
      )
    case 'divider':
      return <div className="h-px bg-slate-100" />
    case 'spacer':
      return <div style={{ height: block.size ?? 8 }} />
    default:
      return null
  }
}

// Blocks flagged `highlight` get a brand ring + optional floating note so you
// can point out exactly what changed in a variant.
function BlockWrap({ block }) {
  if (!block.highlight) return <Block block={block} />
  return (
    <div className="relative rounded-md ring-2 ring-brand-300 ring-offset-2">
      <Block block={block} />
      {block.note && (
        <span className="absolute -right-1 -top-2 rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-medium text-white shadow">
          {block.note}
        </span>
      )}
    </div>
  )
}

function DeviceFrame({ device = 'browser', children }) {
  if (device === 'phone') {
    return (
      <div className="mx-auto w-[190px] rounded-[1.6rem] border-4 border-slate-800 bg-white p-2 shadow-card">
        <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-slate-300" />
        <div className="space-y-2 px-1 pb-1">{children}</div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-rose-300" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        <span className="ml-2 h-3 flex-1 rounded border border-slate-200 bg-white" />
      </div>
      <div className="space-y-2.5 p-3">{children}</div>
    </div>
  )
}

export default function Wireframe({ mock }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {mock.variants.map((v) => (
          <div key={v.label}>
            <div className="mb-2 flex items-center justify-between">
              <Badge tone={/variant/i.test(v.label) ? 'brand' : 'neutral'}>{v.label}</Badge>
              <span className="text-[11px] text-slate-400">{v.caption}</span>
            </div>
            <DeviceFrame device={mock.device}>
              {v.blocks.map((b, i) => (
                <BlockWrap key={i} block={b} />
              ))}
            </DeviceFrame>
          </div>
        ))}
      </div>

      {mock.annotations?.length > 0 && (
        <div>
          <div className="mb-1.5 text-[11px] font-medium text-slate-500">What changes</div>
          <div className="flex flex-wrap gap-1.5">
            {mock.annotations.map((a) => (
              <span
                key={a}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
