// ---------------------------------------------------------------------------
// Mock data for the Agenda dashboard.
//
// This file is intentionally the ONLY place fake data lives. When you wire up
// your real backend, you typically won't touch this file at all — instead you
// replace the function bodies in `client.js` with real `fetch` calls. Keeping
// the shapes here documents the contract your API needs to satisfy.
// ---------------------------------------------------------------------------

// --- KPIs --------------------------------------------------------------------
// The headline metric plus supporting metrics shown on the Overview page.
export const kpis = [
  {
    id: 'activation_rate',
    label: 'Activation Rate',
    description: '% of new teams reaching the "aha" moment within 7 days',
    unit: '%',
    value: 41.8,
    previousValue: 38.4,
    target: 45,
    isHeadline: true,
  },
  {
    id: 'weekly_active_teams',
    label: 'Weekly Active Teams',
    description: 'Teams with at least one active session this week',
    unit: '',
    value: 1284,
    previousValue: 1190,
    target: 1500,
    isHeadline: false,
  },
  {
    id: 'retention_w4',
    label: 'Week-4 Retention',
    description: 'Teams still active 4 weeks after signup',
    unit: '%',
    value: 28.1,
    previousValue: 30.6,
    target: 35,
    isHeadline: false,
  },
  {
    id: 'avg_session_min',
    label: 'Avg Session Length',
    description: 'Median minutes per active session',
    unit: 'm',
    value: 12.4,
    previousValue: 12.1,
    target: 15,
    isHeadline: false,
  },
]

// Week-over-week trend for the headline metric (most recent week last).
export const headlineTrend = [
  { week: 'W14', value: 35.2 },
  { week: 'W15', value: 36.0 },
  { week: 'W16', value: 35.4 },
  { week: 'W17', value: 37.1 },
  { week: 'W18', value: 38.0 },
  { week: 'W19', value: 38.4 },
  { week: 'W20', value: 33.9 }, // dip — surfaced as an anomaly below
  { week: 'W21', value: 39.2 },
  { week: 'W22', value: 40.1 },
  { week: 'W23', value: 41.8 },
]

// --- Anomalies ---------------------------------------------------------------
// Week-over-week anomalies the agent has flagged.
export const anomalies = [
  {
    id: 'an_1',
    metric: 'Activation Rate',
    severity: 'high',
    direction: 'down',
    deltaPct: -11.7,
    week: 'W20',
    detectedAt: '2026-06-22T09:14:00Z',
    summary:
      'Activation dropped 11.7% in W20, well outside the expected band. Correlates with the onboarding checklist redesign rollout.',
    suspectedCause: 'Onboarding checklist redesign (exp-204)',
    status: 'investigating',
  },
  {
    id: 'an_2',
    metric: 'Week-4 Retention',
    severity: 'medium',
    direction: 'down',
    deltaPct: -8.2,
    week: 'W23',
    detectedAt: '2026-06-23T16:40:00Z',
    summary:
      'Retention slipped for teams onboarded during the W20 activation dip — likely a downstream effect rather than a new regression.',
    suspectedCause: 'Cohort effect from W20 activation dip',
    status: 'monitoring',
  },
  {
    id: 'an_3',
    metric: 'Avg Session Length',
    severity: 'low',
    direction: 'up',
    deltaPct: 6.4,
    week: 'W23',
    detectedAt: '2026-06-23T11:02:00Z',
    summary:
      'Session length ticked up after the new insights panel shipped. Positive signal — watching to confirm it holds.',
    suspectedCause: 'Insights panel launch (exp-211)',
    status: 'positive',
  },
]

// --- Experiments -------------------------------------------------------------
export const experiments = [
  {
    id: 'exp-211',
    name: 'Insights panel on dashboard home',
    hypothesis:
      'Surfacing weekly insights on the home screen will increase session length and return visits.',
    status: 'running',
    owner: 'Priya N.',
    metric: 'Avg Session Length',
    lift: 6.4,
    confidence: 0.82,
    startDate: '2026-06-10',
    endDate: null,
    audience: '50% of active teams',
  },
  {
    id: 'exp-204',
    name: 'Onboarding checklist redesign',
    hypothesis:
      'A simplified 3-step checklist will raise activation versus the old 6-step flow.',
    status: 'running',
    owner: 'Marco T.',
    metric: 'Activation Rate',
    lift: -9.1,
    confidence: 0.74,
    startDate: '2026-05-28',
    endDate: null,
    audience: '50% of new teams',
  },
  {
    id: 'exp-198',
    name: 'Invite teammates nudge',
    hypothesis:
      'Prompting an invite after first value moment increases weekly active teams.',
    status: 'completed',
    result: 'win',
    owner: 'Dana K.',
    metric: 'Weekly Active Teams',
    lift: 12.3,
    confidence: 0.97,
    startDate: '2026-04-15',
    endDate: '2026-05-20',
    audience: '100% rollout',
  },
  {
    id: 'exp-187',
    name: 'Pricing page social proof',
    hypothesis: 'Adding customer logos to pricing improves trial starts.',
    status: 'completed',
    result: 'flat',
    owner: 'Dana K.',
    metric: 'Trial Starts',
    lift: 1.1,
    confidence: 0.41,
    startDate: '2026-03-30',
    endDate: '2026-04-27',
    audience: '50% of visitors',
  },
  {
    id: 'exp-176',
    name: 'Slack digest notifications',
    hypothesis: 'A weekly Slack digest brings teams back, improving retention.',
    status: 'completed',
    result: 'loss',
    owner: 'Marco T.',
    metric: 'Week-4 Retention',
    lift: -3.8,
    confidence: 0.88,
    startDate: '2026-03-01',
    endDate: '2026-03-29',
    audience: '30% of teams',
  },
]

// --- Strategy & hypotheses ---------------------------------------------------
export const strategy = {
  mission:
    'Become the default command center where product teams see what matters and act on it together.',
  quarter: 'Q2 2026',
  pillars: [
    {
      id: 'pil_1',
      name: 'Faster time-to-value',
      goal: 'Get new teams to their first insight in under 5 minutes.',
      health: 'at_risk',
      progress: 0.55,
      owner: 'Marco T.',
    },
    {
      id: 'pil_2',
      name: 'Collaboration loops',
      goal: 'Make Agenda something teams open together, not solo.',
      health: 'on_track',
      progress: 0.7,
      owner: 'Dana K.',
    },
    {
      id: 'pil_3',
      name: 'Trustworthy insights',
      goal: 'Every flagged anomaly should be explainable and actionable.',
      health: 'on_track',
      progress: 0.62,
      owner: 'Priya N.',
    },
  ],
}

export const hypotheses = [
  {
    id: 'hyp_1',
    statement:
      'Teams that invite a 2nd member in week 1 retain 2x better than solo teams.',
    pillar: 'Collaboration loops',
    confidence: 'high',
    status: 'validated',
    evidence: 'exp-198 showed +12.3% weekly active teams at 97% confidence.',
  },
  {
    id: 'hyp_2',
    statement:
      'A shorter onboarding checklist raises activation by reducing drop-off.',
    pillar: 'Faster time-to-value',
    confidence: 'low',
    status: 'testing',
    evidence: 'exp-204 currently showing a -9.1% regression — under review.',
  },
  {
    id: 'hyp_3',
    statement:
      'Proactive, explainable anomaly alerts increase trust and session length.',
    pillar: 'Trustworthy insights',
    confidence: 'medium',
    status: 'testing',
    evidence: 'exp-211 early read +6.4% session length.',
  },
  {
    id: 'hyp_4',
    statement: 'Push/Slack digests re-engage dormant teams.',
    pillar: 'Collaboration loops',
    confidence: 'low',
    status: 'rejected',
    evidence: 'exp-176 reduced retention -3.8%. Channel felt like noise.',
  },
]

// --- Google Meet group chat feed ---------------------------------------------
export const meetMessages = [
  {
    id: 'm_1',
    author: 'Marco T.',
    avatarColor: '#f97316',
    text: 'Heads up — activation dipped hard in W20. Pulling the cohort now.',
    time: '2026-06-22T09:20:00Z',
  },
  {
    id: 'm_2',
    author: 'Priya N.',
    avatarColor: '#3366ff',
    text: 'Timing lines up with the checklist redesign going to 50%. Could be us.',
    time: '2026-06-22T09:24:00Z',
  },
  {
    id: 'm_3',
    author: 'Dana K.',
    avatarColor: '#10b981',
    text: 'If exp-204 is the cause we should consider rolling back to 10% while we dig in.',
    time: '2026-06-22T09:31:00Z',
  },
  {
    id: 'm_4',
    author: 'Marco T.',
    avatarColor: '#f97316',
    text: 'Agreed. Can someone confirm the new flow is firing the activation event correctly?',
    time: '2026-06-22T09:33:00Z',
  },
]

// --- Meeting notes -----------------------------------------------------------
export const meetingNotes = [
  {
    id: 'note_1',
    title: 'Weekly metrics review',
    date: '2026-06-23',
    attendees: ['Marco T.', 'Priya N.', 'Dana K.', 'You'],
    summary:
      'Reviewed W23 KPIs. Activation recovered to 41.8% after checklist fix. Retention dip flagged as a W20 cohort effect, not a new regression.',
    actionItems: [
      { text: 'Confirm activation event fires in new checklist flow', owner: 'Priya N.', done: true },
      { text: 'Decide go/no-go on exp-204 rollout', owner: 'Marco T.', done: false },
      { text: 'Draft retention recovery plan for W20 cohort', owner: 'Dana K.', done: false },
    ],
  },
  {
    id: 'note_2',
    title: 'Experiment design sync',
    date: '2026-06-18',
    attendees: ['Priya N.', 'Dana K.'],
    summary:
      'Scoped the insights panel test (exp-211). Agreed on session length as the primary metric and a 2-week minimum runtime.',
    actionItems: [
      { text: 'Instrument insights panel impressions', owner: 'Priya N.', done: true },
      { text: 'Set up guardrail metric on retention', owner: 'Dana K.', done: true },
    ],
  },
]

// --- Agent chat (seed conversation) -----------------------------------------
export const chatSeed = [
  {
    id: 'c_1',
    role: 'assistant',
    text: "Hi! I'm your Agenda agent. I track your KPIs, watch for anomalies, and keep tabs on experiments and strategy. Ask me anything — e.g. \"why did activation drop in W20?\"",
    time: '2026-06-24T08:00:00Z',
  },
]

// Canned agent responses so the chat feels alive without a backend.
// Replace `sendChatMessage` in client.js with a real LLM/agent call.
export const cannedAgentReplies = [
  "Activation dropped 11.7% in W20. The dip lines up exactly with the onboarding checklist redesign (exp-204) going to 50% of new teams. I'd treat exp-204 as the prime suspect — the activation event may not be firing in the new flow.",
  "Right now you have 2 experiments running and 3 completed. exp-198 (invite nudge) was your biggest win at +12.3%. exp-204 (checklist redesign) is currently regressing activation by 9.1% and is worth a decision this week.",
  "Your most at-risk strategy pillar is 'Faster time-to-value' at 55% progress — largely because exp-204 isn't delivering the activation lift you hypothesized. The other two pillars are on track.",
  "I can post that to the team Google Meet chat for you. Want me to send: \"Proposing we roll exp-204 back to 10% until we confirm the activation event fires correctly\"?",
]
