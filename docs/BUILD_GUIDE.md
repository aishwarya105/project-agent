============================================================
AGENDA DASHBOARD — BUILD GUIDE (START HERE)
============================================================
Audience: a complete beginner, OR an AI assistant.
Goal: go from nothing -> a running dashboard -> your real data -> deployed.
No prior knowledge assumed. Follow the steps in order. Do not skip.

If you get stuck, jump to section 12 (COMMON PROBLEMS).

------------------------------------------------------------
0. WHAT YOU ARE BUILDING
------------------------------------------------------------
"Agenda" is a web dashboard for a product team. It shows:
  - Overview: the headline KPI, a week-over-week trend chart, and anomalies
    the agent flagged.
  - Experiments: planned / running / completed experiments, each with a UI mock.
  - Strategy: mission, strategy pillars, and a hypotheses board.
  - Conversations: chat with the agent, a Google Meet group-chat feed you can
    post to, and meeting notes.

GOOD NEWS: the dashboard is ALREADY BUILT. It lives in a Git repository on a
branch called `claude/serene-brown-28bwki`. Right now it runs on fake ("mock")
data. Your job is to: (1) run it, (2) replace the fake data with your real data,
(3) optionally change the look, (4) deploy it so your team can use it.

------------------------------------------------------------
1. GLOSSARY (read this once — it makes everything else make sense)
------------------------------------------------------------
- Terminal / Command line: a text window where you type commands. On Mac it's
  the "Terminal" app. On Windows use "PowerShell".
- Node.js: the engine that runs this kind of web app on your computer.
- npm: the tool (comes with Node.js) that installs the app's building blocks.
- Repository ("repo"): the folder of code, tracked by Git.
- Branch: a named version of the code. Ours is `claude/serene-brown-28bwki`.
- Clone: download the repo to your computer.
- Pull: get the latest changes from the server into your local copy.
- Dev server: a local preview of the app you view in your browser.
- Build: turn the code into final files you can host.
- Component: a reusable piece of the UI (a card, a button, a page).
- Mock data: realistic fake data used until the real data is connected.
- API seam: the ONE file where the app asks for data. Swap it to go live.

------------------------------------------------------------
2. WHAT YOU NEED (one-time setup)
------------------------------------------------------------
2.1 A computer (Mac or Windows) and internet.
2.2 Node.js (version 18 or newer). Get the "LTS" version:
      https://nodejs.org  -> download LTS -> run the installer -> click Next.
    Verify: open a terminal and type:
        node --version
    You should see something like v20.x.x. If you see "command not found",
    Node didn't install — re-run the installer and restart the terminal.
2.3 A code editor: VS Code. https://code.visualstudio.com  -> install.
2.4 Git (to get the code). https://git-scm.com/downloads -> install.
    Verify:  git --version
2.5 Access to the repository (ask whoever set it up for the repo URL and to be
    added as a collaborator). The repo is: aishwarya105/project-agent.

------------------------------------------------------------
3. STEP A — GET THE CODE ONTO YOUR COMPUTER
------------------------------------------------------------
Open a terminal, then type these one at a time (press Enter after each).

  3.1 Go to a folder where you keep projects (Desktop is fine):
        cd ~/Desktop                 (Mac)
        cd %USERPROFILE%\Desktop     (Windows PowerShell)

  3.2 Download the repo (replace <REPO_URL> with the real URL):
        git clone <REPO_URL> project-agent

  3.3 Go into the folder:
        cd project-agent

  3.4 Switch to our branch and get the latest:
        git checkout claude/serene-brown-28bwki
        git pull origin claude/serene-brown-28bwki

  3.5 Confirm you have the latest. Type:
        git log --oneline -5
      You should see recent commit messages near the top (e.g. about the theme
      and the dashboard). If you do, you're good.

IMPORTANT: every command from here on must be run from INSIDE the
`project-agent` folder. If a command fails with "no package.json", you are in
the wrong folder — run `cd` into project-agent first. Quick check:
        ls package.json        -> should print "package.json"

------------------------------------------------------------
4. STEP B — RUN IT LOCALLY (see it in your browser)
------------------------------------------------------------
  4.1 Install the building blocks (do this once, and again after any `git pull`
      that changed package.json):
        npm install

  4.2 Start the live preview:
        npm run dev

  4.3 The terminal prints a line like:  Local:  http://localhost:5173/
      Open that address in your web browser. You should see the dashboard.

  4.4 To stop the preview: click the terminal and press Ctrl + C.

If `npm install` errors, see section 12.

------------------------------------------------------------
5. STEP C — UNDERSTAND THE FOLDERS (1 minute)
------------------------------------------------------------
project-agent/
  index.html              <- the page shell; loads fonts
  package.json            <- the list of building blocks + scripts
  tailwind.config.js      <- THE THEME (colors, fonts). See Theme Spec doc.
  src/
    main.jsx              <- app entry point (don't usually touch)
    App.jsx              <- the 4 pages and their routes
    index.css            <- base styles (background, headings = serif)
    api/
      mockData.js        <- ALL the fake data (and the shape your data needs)
      client.js          <- THE API SEAM: the only file you change to go live
    lib/                 <- small helpers (formatting, data-loading hook)
    components/          <- reusable UI (Sidebar, Topbar, Card, Badge, Wireframe)
    pages/               <- the 4 screens: Overview, Experiments, Strategy,
                            Conversations

You will mostly touch TWO files: `src/api/mockData.js` (your data) and
`src/api/client.js` (where the data comes from).

------------------------------------------------------------
6. STEP D — PUT IN YOUR OWN DATA (still "fake", but yours)
------------------------------------------------------------
The fastest way to make the dashboard show YOUR numbers without a backend:

  6.1 Open `src/api/mockData.js` in VS Code.
  6.2 You'll see clearly labelled sections: kpis, headlineTrend, anomalies,
      experiments, strategy, hypotheses, meetMessages, meetingNotes, etc.
  6.3 Carefully edit the values to match your product. Keep the structure
      (the field names and the punctuation) exactly the same — only change the
      values inside the quotes/numbers.
  6.4 Save. The browser preview updates automatically.

To plan WHAT data to gather, use the "Agenda — Data Tracker" spreadsheets
(separate Drive folder). Each sheet's columns match the field names in
mockData.js one-to-one, so filling them in first makes step 6.3 copy-paste easy.

Rules to avoid breakage:
  - Dates look like "2026-06-24" or "2026-06-24T09:20:00Z". Keep that format.
  - true/false values stay lowercase: true, false.
  - Don't delete commas or braces { }. If the preview shows an error, you
    probably removed a comma or a quote — undo with Ctrl+Z.

------------------------------------------------------------
7. STEP E — CONNECT YOUR REAL BACKEND (go live)
------------------------------------------------------------
When you have real internal services, you replace the bodies of the functions
in `src/api/client.js`. THIS IS THE ONLY FILE YOU NEED TO CHANGE. Keep the
function names and the data shapes the same and nothing else has to change.

Each function and what to connect it to:
  - getOverview()       -> your KPI store + anomaly detector
  - getExperiments()    -> your experimentation platform
  - getStrategy()       -> your strategy/hypotheses source
  - getConversations()  -> Google Meet chat history + meeting-notes store
  - sendChatMessage()   -> your agent / LLM endpoint
  - postToGroupChat()   -> your Google Meet / Chat send API

Example — turning the mock into a real call:

  BEFORE (mock):
    export async function getOverview() {
      await delay()
      return clone({ kpis, headlineTrend, anomalies })
    }

  AFTER (real):
    export async function getOverview() {
      const res = await fetch(`${BASE_URL}/api/overview`)
      if (!res.ok) throw new Error('Failed to load overview')
      return res.json()
    }

Set BASE_URL at the top of client.js (or use an environment variable
VITE_API_BASE_URL). Your backend must return JSON in the SAME shape as the mock
data — the shapes are documented in mockData.js and in the Data Tracker sheets.

SECURITY: never put passwords, API keys, or secret tokens in this front-end
code. The browser can read everything here. Secrets live on your backend only.

------------------------------------------------------------
8. STEP F — CHANGE THE LOOK (optional)
------------------------------------------------------------
Almost the entire look is controlled by TWO color scales in
`tailwind.config.js`: `brand` (the teal accent) and `slate` (the warm
paper/charcoal neutrals). Change those and the whole app re-themes.
Full details, exact values, and component rules are in the "Theme & Design
Spec" document. Hand that doc to your AI when you ask it to restyle anything.

------------------------------------------------------------
9. STEP G — DEPLOY IT (put it online for your team)
------------------------------------------------------------
  9.1 Make the final files:
        npm run build
      This creates a `dist/` folder of static files.
  9.2 Host the `dist/` folder. Easiest options:
        - Vercel (vercel.com) or Netlify (netlify.com): connect the repo, set
          build command `npm run build` and output directory `dist`. Done.
        - Internal static hosting: copy the contents of `dist/` to whatever
          web server / bucket your company uses for static sites.
  9.3 If the app is served from a sub-path (not the root of a domain), tell
      whoever deploys it — a small Vite `base` setting may be needed. Ask your
      AI: "set Vite base path to /agenda/ for deployment".

------------------------------------------------------------
10. STEP H — HAND IT TO YOUR INTERNAL AI SYSTEM
------------------------------------------------------------
Give your AI the "AI Build Prompt" document (in this Build Kit). It is a
self-contained spec: tech stack, file structure, data contract, theme tokens,
conventions, and acceptance criteria. Paste it in, then ask for the specific
change you want (e.g. "wire getExperiments to our API at /api/experiments" or
"add a new page that lists customer interviews").

------------------------------------------------------------
11. WHERE EVERYTHING LIVES
------------------------------------------------------------
  - The code:            Git repo aishwarya105/project-agent,
                         branch claude/serene-brown-28bwki
  - This Build Kit:      Google Drive folder "Agenda — Build Kit"
       00 Build Guide (this doc)
       01 Build Checklist (spreadsheet)
       02 Theme & Design Spec
       03 AI Build Prompt
  - Data to fill in:     Google Drive folder "Agenda — Data Tracker"
  - In-repo copies:      the `docs/` folder in the repository

------------------------------------------------------------
12. COMMON PROBLEMS (and the exact fix)
------------------------------------------------------------
PROBLEM: `npm install` says "EACCES: permission denied ... /.npm/..."
  CAUSE: npm was once run with `sudo`, which broke the cache ownership.
  FIX:   sudo chown -R $(whoami) ~/.npm     (Mac; enter your password)
         then run `npm install` again. NEVER use `sudo npm install`.

PROBLEM: `npm install` writes to your home folder / "no package.json".
  CAUSE: you are not inside the project folder.
  FIX:   cd into the `project-agent` folder first. Check with:
         ls package.json   (should print package.json)

PROBLEM: "I changed code / pulled, but the browser shows the old version."
  FIX:   1) make sure you ran `git pull origin claude/serene-brown-28bwki`
         2) stop the dev server (Ctrl+C) and run `npm run dev` again
         3) hard-refresh the browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win)

PROBLEM: the preview shows a red error screen after editing mockData.js.
  CAUSE: a missing comma, quote, or brace.
  FIX:   press Ctrl+Z to undo your last edit until it works, then redo the
         change more carefully.

PROBLEM: `node` or `git` "command not found".
  FIX:   install them (section 2) and restart the terminal.

END OF BUILD GUIDE.
