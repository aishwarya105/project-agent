import { initialsOf } from '../../lib/format.js'

// Colored initials avatar — no image assets needed.
export default function Avatar({ name, color = '#78716C', size = 32 }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
      title={name}
    >
      {initialsOf(name)}
    </span>
  )
}
