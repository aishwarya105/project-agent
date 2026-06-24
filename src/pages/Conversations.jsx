import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  Video,
  FileText,
  Share2,
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getConversations, sendChatMessage, postToGroupChat } from '../api/client.js'
import { formatClockTime, formatDate } from '../lib/format.js'

const SUGGESTIONS = [
  'Why did activation drop in W20?',
  'Summarize our running experiments',
  'Which strategy pillar is most at risk?',
]

// ---- Agent chat -------------------------------------------------------------
function AgentChat({ seed, onPostToGroup }) {
  const [messages, setMessages] = useState(seed)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  async function send(text) {
    const content = text ?? input
    if (!content.trim() || thinking) return
    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: content,
      time: new Date().toISOString(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)
    try {
      const reply = await sendChatMessage(content)
      setMessages((m) => [...m, reply])
    } finally {
      setThinking(false)
    }
  }

  return (
    <Card className="flex h-[640px] flex-col">
      <CardHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" /> Agenda Agent
          </span>
        }
        subtitle="Ask about metrics, experiments, or strategy"
        action={<Badge tone="success">online</Badge>}
      />

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {m.role === 'assistant' ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
            ) : (
              <Avatar name="Aishwarya R." color="#0E7C7B" size={28} />
            )}
            <div className={`max-w-[78%] ${m.role === 'user' ? 'items-end' : ''}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {m.text}
              </div>
              <div
                className={`mt-1 flex items-center gap-2 text-[11px] text-slate-400 ${
                  m.role === 'user' ? 'justify-end' : ''
                }`}
              >
                <span>{formatClockTime(m.time)}</span>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => onPostToGroup(m.text)}
                    className="inline-flex items-center gap-1 rounded px-1 text-slate-400 hover:text-brand-600"
                    title="Post this to the Google Meet group chat"
                  >
                    <Share2 className="h-3 w-3" /> Post to chat
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:border-brand-300 hover:text-brand-600"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message the agent…"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 p-2 text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Card>
  )
}

// ---- Google Meet feed -------------------------------------------------------
function MeetFeed({ seed, draft, onDraftConsumed }) {
  const [messages, setMessages] = useState(seed)
  const [input, setInput] = useState('')
  const [posting, setPosting] = useState(false)
  const [fromAgent, setFromAgent] = useState(false)

  // When the agent hands a message over to post, prefill the composer.
  useEffect(() => {
    if (draft) {
      setInput(draft)
      setFromAgent(true)
      onDraftConsumed()
    }
  }, [draft, onDraftConsumed])

  async function post() {
    if (!input.trim() || posting) return
    setPosting(true)
    try {
      const msg = await postToGroupChat(input)
      setMessages((m) => [...m, msg])
      setInput('')
      setFromAgent(false)
    } finally {
      setPosting(false)
    }
  }

  return (
    <Card className="flex h-[640px] flex-col">
      <CardHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Video className="h-4 w-4 text-emerald-500" /> Product Team · Google Meet
          </span>
        }
        subtitle="Live group chat"
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2.5">
            <Avatar name={m.author} color={m.avatarColor} size={28} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{m.author}</span>
                <span className="text-[11px] text-slate-400">{formatClockTime(m.time)}</span>
                {m.postedViaAgent && <Badge tone="brand">via agent</Badge>}
              </div>
              <p className="mt-0.5 text-sm text-slate-700">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 px-4 py-3">
        {fromAgent && (
          <p className="mb-1.5 text-[11px] text-brand-600">
            Drafted by agent — review before sending.
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            post()
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setFromAgent(false)
            }}
            placeholder="Message the group chat…"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={posting || !input.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 p-2 text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          >
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </Card>
  )
}

// ---- Meeting notes ----------------------------------------------------------
function MeetingNotes({ notes }) {
  return (
    <Card>
      <CardHeader
        title={
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" /> Meeting notes
          </span>
        }
        subtitle="Summaries and action items the agent keeps in sync"
      />
      <CardBody className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">{note.title}</h4>
              <span className="text-xs text-slate-400">{formatDate(note.date)}</span>
            </div>
            <div className="mt-1 flex -space-x-1.5">
              {note.attendees.map((a) => (
                <span key={a} className="ring-2 ring-white rounded-full">
                  <Avatar name={a} color="#A89F90" size={20} />
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{note.summary}</p>
            <div className="mt-3 space-y-1.5">
              {note.actionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {item.done ? (
                    <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
                  )}
                  <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-700'}>
                    {item.text}
                    <span className="text-slate-400"> · {item.owner}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default function Conversations() {
  const { data, loading, error } = useAsync(getConversations)
  // Message the agent hands to the Meet composer for review before sending.
  const [draftForGroup, setDraftForGroup] = useState(null)

  if (loading) return <Spinner label="Loading conversations…" />
  if (error)
    return <p className="text-sm text-rose-600">Couldn’t load conversations: {error.message}</p>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AgentChat seed={data.chat} onPostToGroup={(text) => setDraftForGroup(text)} />
        <MeetFeed
          seed={data.meetMessages}
          draft={draftForGroup}
          onDraftConsumed={() => setDraftForGroup(null)}
        />
      </div>
      <MeetingNotes notes={data.meetingNotes} />
    </div>
  )
}
