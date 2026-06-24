# Agenda — Product Command Center (front end)

A dashboard UI for a product agent that tracks KPIs, flags week-over-week
anomalies, follows experiments, keeps the product strategy in view, and pulls
in team conversations (Google Meet chat + meeting notes) — all in one place.

This repo is the **front end only**, built to be wired up to your internal
backend. Today it runs entirely on mock data so you can demo the full
experience without any services.

## Stack

- **React 18 + Vite** — fast SPA, no framework lock-in
- **Tailwind CSS** — clean, modern light theme
- **Recharts** — KPI trend chart
- **lucide-react** — icons
- **react-router-dom** — page routing

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## What's in it

| Page | What it shows |
| --- | --- |
| **Overview** | Headline KPI + supporting metrics, week-over-week trend with anomalies marked, and an agent-flagged anomaly list. |
| **Experiments** | Planned, running, and completed experiments with lift, confidence, owner, and win/loss results. Click any row to open a detail view with the experiment's **UI mock** (control vs. variant) rendered as a wireframe. |
| **Strategy** | Mission, strategy pillars with health/progress, and a hypotheses board tied to experiments. |
| **Conversations** | Chat with the agent, a live Google Meet group-chat feed you can post to (including agent-drafted messages), and synced meeting notes with action items. |

## Wiring up your real backend

All fake data lives in **one** place and is served through a single seam:

- `src/api/mockData.js` — the mock data and the **shapes** your API must return.
- `src/api/client.js` — the functions the UI calls. **This is the only file you
  need to change to go live.** Replace each function body with a real `fetch`
  (or your agent/LLM streaming call) and keep the return shapes the same.

```js
// src/api/client.js — before
export async function getOverview() {
  await delay()
  return clone({ kpis, headlineTrend, anomalies })
}

// after
export async function getOverview() {
  const res = await fetch(`${BASE_URL}/api/overview`)
  if (!res.ok) throw new Error('Failed to load overview')
  return res.json()
}
```

Set `BASE_URL` (or a `VITE_API_BASE_URL` env var) at the top of `client.js`.

### Integration points to map to your systems

- `getOverview` → your KPI store + anomaly detector
- `getExperiments` → your experimentation platform
- `getStrategy` → strategy/hypotheses source (doc, Notion, internal tool)
- `getConversations` → Google Meet chat history + meeting-notes store
- `sendChatMessage` → your agent / LLM endpoint (consider streaming)
- `postToGroupChat` → Google Meet / Chat send API

## Project structure

```
src/
  api/         # mock data + the client seam to swap for real APIs
  components/  # layout (sidebar, topbar) + small UI primitives
  lib/         # formatting helpers + useAsync hook
  pages/       # Overview, Experiments, Strategy, Conversations
```

## UI mocks

Each experiment can carry a `mock` field (see `mockData.js`) that's rendered by
`src/components/Wireframe.jsx` — a small declarative renderer. A mock is a
device frame (`browser` or `phone`) plus a list of `variants`, each a list of
`blocks` (`header`, `progress`, `list`, `button`, `callout`, `metric`, …). No
image assets to manage, and `highlight: true` on a block draws attention to
what changed in the variant.

If your design team would rather use real screenshots, swap the `<Block>`
renderer in `Wireframe.jsx` for an `<img src={variant.image} />` and put image
URLs in the data — the rest of the UI stays the same.

## Notes

- The agent's chat replies are canned (`cannedAgentReplies` in `mockData.js`)
  so the demo feels alive without a backend.
- "Post to chat" on an agent message drafts it into the Google Meet composer for
  review before sending — a deliberate human-in-the-loop step.
