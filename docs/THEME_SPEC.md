============================================================
AGENDA DASHBOARD — THEME & DESIGN SPEC
============================================================
This document fully describes the visual design ("Soft" theme: warm cream +
muted teal + serif headings). Give it to any designer or AI that needs to
reproduce or extend the look. Exact values are authoritative.

------------------------------------------------------------
1. DESIGN PRINCIPLES
------------------------------------------------------------
- Calm and editorial, not "loud SaaS". Warm paper background, low-saturation
  teal accent used sparingly, generous whitespace.
- Serif display headings (Fraunces) + clean sans body (Inter).
- Color carries meaning: the accent is for primary actions/branding; status
  colors (green/amber/red/blue) are reserved for state and must stay consistent.
- One accent. Avoid introducing new random colors; extend the existing scales.

------------------------------------------------------------
2. COLOR TOKENS (authoritative hex values)
------------------------------------------------------------
ACCENT — "brand" (muted teal). Primary buttons, links, active nav, chart line,
focus rings, KPI progress, agent chat bubbles.
  brand-50  #E6F2F1     (tinted backgrounds, active-nav fill)
  brand-100 #C9E6E5
  brand-200 #A3D4D2     (rings/hairlines)
  brand-300 #6FB9B6     (hover borders)
  brand-400 #3C9D9A
  brand-500 #0E7C7B     (PRIMARY accent: button fill, icons, chart, progress)
  brand-600 #0B6160     (hover, accent text)
  brand-700 #094E4D     (active-nav text)
  brand-800 #073E3E
  brand-900 #063231

NEUTRALS — "slate" (warm paper light shades, warm charcoal dark shades). Used
for canvas, cards, borders, and text. NOTE: this overrides Tailwind's default
cool slate with a warm scale on purpose.
  slate-50  #F2F0EA     (app canvas / page background)
  slate-100 #ECEAE2     (chips, subtle fills, hairline dividers)
  slate-200 #DEDBD0     (card borders, input borders)
  slate-300 #CFCBBE     (hover borders, scrollbar thumb-ish)
  slate-400 #9C988D     (muted text, captions, chart axis)
  slate-500 #6E6B64     (secondary text/labels)
  slate-600 #57544E     (body text)
  slate-700 #46443F     (strong body text)
  slate-800 #34322E
  slate-900 #2B2A28     (primary text / ink / headings)

CARD SURFACE: pure white (#FFFFFF) on the cream canvas.

SEMANTIC STATUS COLORS (Tailwind defaults — DO NOT recolor; they signal state):
  success / positive  -> emerald  (emerald-50/600/700)   e.g. wins, "up"
  warning / planned   -> amber    (amber-50/600/700)      e.g. planned, at-risk
  danger / negative   -> rose     (rose-50/500/600)       e.g. losses, "down"
  info / running      -> sky      (sky-50/500/600/700)    e.g. running experiments
ANOMALY MARKER on the trend chart: rose-500 (#F43F5E) dot.
GOOGLE MEET accent: emerald-500 (the Meet feed header icon + post button) — a
deliberate nod to Google's product color; keep it emerald, not teal.

------------------------------------------------------------
3. TYPOGRAPHY
------------------------------------------------------------
- Body / UI text: "Inter" (sans). Loaded via Google Fonts in index.html.
- Headings + headline numbers: "Fraunces" (serif), class `font-display`.
  Applied globally to h1-h4 via a base rule in src/index.css, and explicitly to
  the headline KPI value and the strategy mission and stat numbers.
- Typical sizes (Tailwind classes):
    Page title (Topbar h1): text-base font-semibold
    Card title (h3):        text-sm font-semibold
    KPI big number:         font-display text-2xl font-semibold tracking-tight
    Body:                   text-sm
    Captions/meta:          text-xs / text-[11px], color slate-400/500
- Font feature settings on body: 'cv11','ss01' (Inter stylistic set).

------------------------------------------------------------
4. SURFACES, RADIUS, SHADOW
------------------------------------------------------------
- App canvas: bg-slate-50 (cream). Content max width: max-w-6xl, page padding
  px-5 py-6.
- Cards: white, rounded-2xl, border border-slate-200, shadow `card`.
    card shadow = 0 1px 2px 0 rgb(43 42 40 / 0.04), 0 2px 10px 0 rgb(43 42 40 / 0.06)
- "POP" cards (KPI cards + Experiment stat cards): playful hard-offset shadow.
  Two variants (written as full static classes so Tailwind detects them):
    navy:  border-2 border-slate-900 shadow-[4px_4px_0_0_#2B2A28]
           hover:shadow-[6px_6px_0_0_#2B2A28]
    brand: border-2 border-brand-600 shadow-[4px_4px_0_0_#0E7C7B]
           hover:shadow-[6px_6px_0_0_#0E7C7B]
  Plus a subtle hover lift: hover:-translate-x-0.5 hover:-translate-y-0.5.
  Usage: the headline KPI uses popColor="brand"; all other KPI/stat cards use
  popColor="navy". Dense cards (chart, lists, modal) do NOT use pop.
- Modal: rounded-2xl, white, shadow-xl, backdrop bg-slate-900/40 with blur.

------------------------------------------------------------
5. THE TAILWIND CONFIG (copy-paste source of truth)
------------------------------------------------------------
File: tailwind.config.js -> theme.extend. This is the entire theme engine.

  colors: {
    brand: { 50:'#E6F2F1',100:'#C9E6E5',200:'#A3D4D2',300:'#6FB9B6',
             400:'#3C9D9A',500:'#0E7C7B',600:'#0B6160',700:'#094E4D',
             800:'#073E3E',900:'#063231' },
    slate: { 50:'#F2F0EA',100:'#ECEAE2',200:'#DEDBD0',300:'#CFCBBE',
             400:'#9C988D',500:'#6E6B64',600:'#57544E',700:'#46443F',
             800:'#34322E',900:'#2B2A28' },
  },
  fontFamily: {
    sans:    ['Inter', ...system sans fallbacks],
    display: ['Fraunces','ui-serif','Georgia','Cambria','serif'],
  },
  boxShadow: {
    card: '0 1px 2px 0 rgb(43 42 40 / 0.04), 0 2px 10px 0 rgb(43 42 40 / 0.06)',
  },

TO RE-THEME THE WHOLE APP: change `brand` (accent) and/or `slate` (neutrals).
Everything else cascades because components use brand-*/slate-* utilities.

------------------------------------------------------------
6. COMPONENT INVENTORY (what exists + how it's styled)
------------------------------------------------------------
Layout
  - Sidebar (components/Sidebar.jsx): white, 240px (w-60), logo tile bg-brand-500,
    nav items; active item = bg-brand-50 text-brand-700.
  - Topbar (components/Topbar.jsx): sticky, translucent white + blur, page
    title (serif) + subtitle, search pill, notifications bell, user avatar.
  - Layout (components/Layout.jsx): sidebar + topbar + scrolling main, content
    centered at max-w-6xl.
UI primitives (components/ui/)
  - Card (Card, CardHeader, CardBody) with the `pop`/`popColor` props above.
  - Badge: tones neutral|brand|success|warning|danger|info, pill, ring-inset.
  - Avatar: colored circle with initials (no images). Default color slate-500.
  - Modal: overlay dialog, closes on backdrop click or Esc, locks body scroll.
  - Spinner: centered loading indicator.
Feature components
  - Wireframe (components/Wireframe.jsx): renders UI mocks for experiments from
    data. Device frame = browser or phone. Block types: header, subhead, text,
    progress, list, button, input, image, metric, callout, bars, divider,
    spacer. A block with highlight:true gets a brand ring + small note tag.
  - ExperimentDetail: the modal body (hypothesis, meta grid, the Wireframe).
Pages (pages/)
  - Overview: KPI pop cards + trend AreaChart (Recharts, teal) + anomaly list.
  - Experiments: stat pop cards + filter tabs + clickable rows -> detail modal.
  - Strategy: mission card + pillar cards (progress) + hypotheses board.
  - Conversations: agent chat (left) + Google Meet feed (right) + meeting notes.

------------------------------------------------------------
7. ICONOGRAPHY & CHARTS
------------------------------------------------------------
- Icons: lucide-react. Sizes h-4 w-4 (16px) typical, h-[18px] for nav.
- Charts: recharts. Trend line stroke #0E7C7B (brand-500), gradient fill from
  #0E7C7B at 0.22 opacity to 0. Grid stroke #EFEAE1, axis text #A89F90.

------------------------------------------------------------
8. ACCESSIBILITY & QUALITY BAR
------------------------------------------------------------
- Maintain text contrast: body text slate-600/700/900 on white/cream is fine;
  do not put slate-400 text on white for anything important.
- Every interactive control needs a visible focus state (inputs use
  focus:ring-2 focus:ring-brand-100 focus:border-brand-400).
- Buttons/links that are icons-only need an aria-label.
- Keep the layout responsive: grids collapse to 1-2 columns on small screens.

END OF THEME & DESIGN SPEC.
