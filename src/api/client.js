// ---------------------------------------------------------------------------
// API client — the single seam between the UI and your data source.
//
// Today every function returns mock data after a small artificial delay so the
// UI exercises real loading states. To go live, replace each body with a real
// `fetch` to your internal services. The function signatures and return shapes
// are the contract your backend needs to honor — keep them stable and the UI
// won't need to change.
//
// Example real implementation:
//
//   export async function getKpis() {
//     const res = await fetch(`${BASE_URL}/api/kpis`)
//     if (!res.ok) throw new Error('Failed to load KPIs')
//     return res.json()
//   }
// ---------------------------------------------------------------------------

import {
  kpis,
  headlineTrend,
  anomalies,
  experiments,
  strategy,
  hypotheses,
  meetMessages,
  meetingNotes,
  chatSeed,
  cannedAgentReplies,
} from './mockData.js'

// Flip to your gateway when wiring real endpoints, e.g. via Vite env:
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
export const BASE_URL = ''

// Simulate network latency so loading/empty/error states are real.
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))
const clone = (data) => JSON.parse(JSON.stringify(data))

// --- Reads -------------------------------------------------------------------

export async function getOverview() {
  await delay()
  return clone({ kpis, headlineTrend, anomalies })
}

export async function getExperiments() {
  await delay()
  return clone(experiments)
}

export async function getStrategy() {
  await delay()
  return clone({ strategy, hypotheses })
}

export async function getConversations() {
  await delay()
  return clone({ meetMessages, meetingNotes, chat: chatSeed })
}

// --- Writes / actions --------------------------------------------------------

let _replyIndex = 0

// Talk to the agent. Replace with a streaming call to your agent/LLM backend.
export async function sendChatMessage(text) {
  await delay(700)
  const reply = cannedAgentReplies[_replyIndex % cannedAgentReplies.length]
  _replyIndex += 1
  return {
    id: `c_${Date.now()}`,
    role: 'assistant',
    text: reply,
    time: new Date().toISOString(),
    // When backed by a real agent, also surface the user's message echo,
    // tool calls, and citations here.
  }
}

// Post a message to the team's Google Meet group chat.
// Replace with a call to your Meet/Chat integration.
export async function postToGroupChat(text) {
  await delay(600)
  return {
    id: `m_${Date.now()}`,
    author: 'You',
    avatarColor: '#9A3412',
    text,
    time: new Date().toISOString(),
    postedViaAgent: true,
  }
}
