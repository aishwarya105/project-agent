import { useEffect } from 'react'
import { X } from 'lucide-react'

// Generic overlay modal. Closes on backdrop click or Escape.
export default function Modal({ open, onClose, title, subtitle, action, children, maxWidth = 'max-w-3xl' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // Prevent the page behind from scrolling while open.
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`my-8 w-full ${maxWidth} rounded-xl border border-slate-200 bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {action}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
