import { useEffect, useState, useCallback } from 'react'

// Tiny data-fetching hook so every page gets consistent loading/error states
// without pulling in a data library. Swap for React Query later if you like.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps)

  useEffect(() => {
    let alive = true
    setState({ data: null, loading: true, error: null })
    run()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }))
    return () => {
      alive = false
    }
  }, [run])

  return state
}
