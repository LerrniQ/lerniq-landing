import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft, ChevronUp, ChevronDown, Trash2, Plus,
  Check, Eye, BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

type QuestionType =
  | 'short_text' | 'long_text' | 'multiple_choice' | 'checkboxes'
  | 'yes_no' | 'scale' | 'email' | 'phone' | 'number'

interface Question {
  id: number
  position: number
  type: QuestionType
  title: string
  description: string | null
  required: boolean
  options: string[] | { min: number; max: number; minLabel?: string; maxLabel?: string } | null
}

type Audience = 'all' | 'student' | 'lecturer' | 'course_rep'

interface Survey {
  id: number
  title: string
  slug: string
  description: string | null
  welcome_title: string | null
  welcome_description: string | null
  welcome_button_text: string
  audience: Audience
  published: boolean
  preview_token: string
  questions: Question[]
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short_text',      label: 'Short Text' },
  { value: 'long_text',       label: 'Long Text' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkboxes',      label: 'Checkboxes' },
  { value: 'yes_no',          label: 'Yes / No' },
  { value: 'scale',           label: 'Scale' },
  { value: 'email',           label: 'Email' },
  { value: 'phone',           label: 'Phone' },
  { value: 'number',          label: 'Number' },
]

function defaultOptions(type: QuestionType) {
  if (type === 'multiple_choice' || type === 'checkboxes') return ['Option 1', 'Option 2']
  if (type === 'scale') return { min: 1, max: 5, minLabel: '', maxLabel: '' }
  return null
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

// ── Question editor panel ─────────────────────────────────────────────────────
function QuestionEditor({
  question, surveyId, onSave, onClose,
}: {
  question: Question
  surveyId: number
  onSave: (q: Question) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState<Question>({ ...question })
  const [saving, setSaving] = useState(false)

  const update = (patch: Partial<Question>) => setLocal(prev => ({ ...prev, ...patch }))

  const isListType = local.type === 'multiple_choice' || local.type === 'checkboxes'
  const isScale    = local.type === 'scale'
  const listOpts   = isListType ? (local.options as string[] ?? []) : []
  const scaleOpts  = isScale    ? (local.options as { min: number; max: number; minLabel?: string; maxLabel?: string } ?? { min: 1, max: 5 }) : null

  // Reset options when type changes
  const changeType = (type: QuestionType) => update({ type, options: defaultOptions(type) })

  const addOption    = () => update({ options: [...listOpts, `Option ${listOpts.length + 1}`] })
  const removeOption = (i: number) => update({ options: listOpts.filter((_, idx) => idx !== i) })
  const editOption   = (i: number, val: string) => {
    const next = [...listOpts]; next[i] = val; update({ options: next })
  }

  async function save() {
    setSaving(true)
    try {
      const res = await axios.put<Question>(
        `${API_URL}/admin/surveys/${surveyId}/questions/${local.id}`,
        {
          type:        local.type,
          title:       local.title,
          description: local.description,
          required:    local.required,
          options:     local.options,
        },
        { headers: authHeaders() }
      )
      onSave(res.data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-white/60 uppercase tracking-wider">Edit question</p>
        <button onClick={onClose} className="text-white/30 hover:text-white text-xs">✕ close</button>
      </div>

      {/* Type */}
      <div>
        <Label>Type</Label>
        <select
          value={local.type}
          onChange={e => changeType(e.target.value as QuestionType)}
          className="w-full mt-1 bg-white/[0.06] border border-white/[0.14] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue"
        >
          {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Title */}
      <div>
        <Label>Question</Label>
        <Input value={local.title} onChange={e => update({ title: e.target.value })} placeholder="Your question" />
      </div>

      {/* Description */}
      <div>
        <Label>Description <span className="text-white/30 font-normal">(optional)</span></Label>
        <Input
          value={local.description ?? ''}
          onChange={e => update({ description: e.target.value || null })}
          placeholder="Add a hint or context"
        />
      </div>

      {/* Options for list types */}
      {isListType && (
        <div>
          <Label>Options</Label>
          <div className="mt-2 space-y-2">
            {listOpts.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <Input value={opt} onChange={e => editOption(i, e.target.value)} />
                <button
                  onClick={() => removeOption(i)}
                  className="text-white/30 hover:text-red-400 transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-sm text-brand-blue hover:text-white transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> Add option
            </button>
          </div>
        </div>
      )}

      {/* Scale config */}
      {isScale && scaleOpts && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Min</Label>
              <Input
                type="number"
                value={scaleOpts.min}
                onChange={e => update({ options: { ...scaleOpts, min: Number(e.target.value) } })}
              />
            </div>
            <div>
              <Label>Max</Label>
              <Input
                type="number"
                value={scaleOpts.max}
                onChange={e => update({ options: { ...scaleOpts, max: Number(e.target.value) } })}
              />
            </div>
          </div>
          <div>
            <Label>Min label <span className="text-white/30 font-normal">(optional)</span></Label>
            <Input
              value={scaleOpts.minLabel ?? ''}
              onChange={e => update({ options: { ...scaleOpts, minLabel: e.target.value } })}
              placeholder="e.g. Not at all"
            />
          </div>
          <div>
            <Label>Max label <span className="text-white/30 font-normal">(optional)</span></Label>
            <Input
              value={scaleOpts.maxLabel ?? ''}
              onChange={e => update({ options: { ...scaleOpts, maxLabel: e.target.value } })}
              placeholder="e.g. Absolutely"
            />
          </div>
        </div>
      )}

      {/* Required toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => update({ required: !local.required })}
          className={`w-10 h-6 rounded-full transition-colors ${local.required ? 'bg-brand-blue' : 'bg-white/20'} relative`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${local.required ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
        <span className="text-sm text-white/70">Required</span>
      </label>

      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save question'}
      </Button>
    </div>
  )
}

// ── Welcome page editor ───────────────────────────────────────────────────────
const AUDIENCE_OPTIONS: { value: Audience; label: string }[] = [
  { value: 'all',        label: 'Everyone' },
  { value: 'student',    label: 'Students' },
  { value: 'lecturer',   label: 'Lecturers' },
  { value: 'course_rep', label: 'Course Reps' },
]

function WelcomeEditor({ survey, onSave }: { survey: Survey; onSave: (s: Survey) => void }) {
  const [local, setLocal] = useState({
    title:               survey.title,
    welcome_title:       survey.welcome_title ?? '',
    welcome_description: survey.welcome_description ?? '',
    welcome_button_text: survey.welcome_button_text,
    audience:            survey.audience ?? 'all' as Audience,
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await axios.put<Survey>(
        `${API_URL}/admin/surveys/${survey.id}`,
        { ...local },
        { headers: authHeaders() }
      )
      onSave(res.data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <p className="font-semibold text-sm text-white/60 uppercase tracking-wider">Welcome page</p>

      <div>
        <Label>Survey title</Label>
        <Input value={local.title} onChange={e => setLocal(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <Label>Welcome heading <span className="text-white/30 font-normal">(optional)</span></Label>
        <Input
          value={local.welcome_title}
          onChange={e => setLocal(p => ({ ...p, welcome_title: e.target.value }))}
          placeholder="e.g. Hi there! 👋"
        />
      </div>
      <div>
        <Label>Welcome description <span className="text-white/30 font-normal">(optional)</span></Label>
        <textarea
          value={local.welcome_description}
          onChange={e => setLocal(p => ({ ...p, welcome_description: e.target.value }))}
          placeholder="Briefly explain what this survey is about and how long it takes."
          rows={3}
          className="w-full mt-1 bg-white/[0.06] border border-white/[0.14] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-blue resize-none"
        />
      </div>
      <div>
        <Label>Start button text</Label>
        <Input
          value={local.welcome_button_text}
          onChange={e => setLocal(p => ({ ...p, welcome_button_text: e.target.value }))}
          placeholder="Start"
        />
      </div>
      <div>
        <Label>Audience</Label>
        <select
          value={local.audience}
          onChange={e => setLocal(p => ({ ...p, audience: e.target.value as Audience }))}
          className="w-full mt-1 bg-white/[0.06] border border-white/[0.14] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue"
        >
          {AUDIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save welcome page'}
      </Button>
    </div>
  )
}

// ── Main builder ──────────────────────────────────────────────────────────────
export default function SurveyBuilder() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [survey,    setSurvey]    = useState<Survey | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selected,  setSelected]  = useState<number | 'welcome'>('welcome')
  const [loading,   setLoading]   = useState(true)
  const [toggling,  setToggling]  = useState(false)
  const [copied,    setCopied]    = useState(false)

  const load = useCallback(async () => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    setLoading(true)
    try {
      const res = await axios.get<Survey>(`${API_URL}/admin/surveys/${id}`, { headers: authHeaders() })
      setSurvey(res.data)
      setQuestions(res.data.questions)
    } catch {
      navigate('/admin/surveys')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { load() }, [load])

  async function addQuestion() {
    if (!survey) return
    const res = await axios.post<Question>(
      `${API_URL}/admin/surveys/${survey.id}/questions`,
      { type: 'short_text', title: 'New question', required: true, options: null },
      { headers: authHeaders() }
    )
    setQuestions(prev => [...prev, res.data])
    setSelected(res.data.id)
  }

  async function deleteQuestion(qid: number) {
    if (!survey) return
    await axios.delete(`${API_URL}/admin/surveys/${survey.id}/questions/${qid}`, { headers: authHeaders() })
    setQuestions(prev => prev.filter(q => q.id !== qid))
    setSelected('welcome')
  }

  async function move(index: number, dir: -1 | 1) {
    if (!survey) return
    const next = [...questions]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    setQuestions(next)
    await axios.put(
      `${API_URL}/admin/surveys/${survey.id}/questions/reorder`,
      { order: next.map(q => q.id) },
      { headers: authHeaders() }
    )
  }

  async function togglePublish() {
    if (!survey) return
    setToggling(true)
    try {
      const action = survey.published ? 'unpublish' : 'publish'
      const res = await axios.post<Survey>(
        `${API_URL}/admin/surveys/${survey.id}/${action}`,
        {},
        { headers: authHeaders() }
      )
      setSurvey(res.data)
    } finally {
      setToggling(false)
    }
  }

  function copyPreviewLink() {
    if (!survey) return
    navigator.clipboard.writeText(`${window.location.origin}/s/${survey.slug}?token=${survey.preview_token}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const selectedQuestion = questions.find(q => q.id === selected)

  if (loading || !survey) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white/40">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">

      {/* Top bar */}
      <header className="px-6 py-4 border-b border-white/[0.1] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/admin/surveys" className="text-white/50 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <p className="font-clash font-bold text-lg truncate">{survey.title}</p>
          <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
            survey.published ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
          }`}>
            {survey.published ? 'Live' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyPreviewLink}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg border border-white/[0.1] hover:border-white/[0.3]"
          >
            {copied ? <><Check size={13} className="text-green-400" /> Copied</> : <><Eye size={13} /> Preview link</>}
          </button>
          <button
            onClick={() => navigate(`/admin/surveys/${survey.id}/responses`)}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-2 rounded-lg border border-white/[0.1] hover:border-white/[0.3]"
          >
            <BarChart2 size={13} /> Responses
          </button>
          <Button onClick={togglePublish} disabled={toggling} variant={survey.published ? 'outline' : 'default'}>
            {toggling ? '…' : survey.published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Body: two columns */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — question list */}
        <aside className="w-72 shrink-0 border-r border-white/[0.1] flex flex-col overflow-y-auto">

          {/* Welcome page item */}
          <button
            onClick={() => setSelected('welcome')}
            className={`w-full text-left px-4 py-3 border-b border-white/[0.06] transition-colors ${
              selected === 'welcome' ? 'bg-brand-blue/20 text-white' : 'text-white/60 hover:bg-white/[0.04]'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-white/40">Welcome page</p>
            <p className="text-sm truncate">{survey.welcome_title || survey.title}</p>
          </button>

          {/* Questions */}
          {questions.map((q, i) => (
            <div
              key={q.id}
              onClick={() => setSelected(q.id)}
              className={`group flex items-center gap-2 px-3 py-3 border-b border-white/[0.06] cursor-pointer transition-colors ${
                selected === q.id ? 'bg-brand-blue/20' : 'hover:bg-white/[0.04]'
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); move(i, -1) }} className="text-white/40 hover:text-white">
                  <ChevronUp size={12} />
                </button>
                <button onClick={e => { e.stopPropagation(); move(i, 1) }} className="text-white/40 hover:text-white">
                  <ChevronDown size={12} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/30 mb-0.5">{i + 1} · {q.type.replace(/_/g, ' ')}</p>
                <p className="text-sm truncate text-white/80">{q.title}</p>
              </div>

              <button
                onClick={e => { e.stopPropagation(); deleteQuestion(q.id) }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {/* Add question */}
          <button
            onClick={addQuestion}
            className="m-3 mt-4 flex items-center justify-center gap-2 text-sm text-brand-blue hover:text-white border border-dashed border-brand-blue/40 hover:border-white/30 rounded-xl py-3 transition-colors"
          >
            <Plus size={15} /> Add question
          </button>
        </aside>

        {/* Right — editor */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-lg mx-auto">
            {selected === 'welcome' ? (
              <WelcomeEditor survey={survey} onSave={s => setSurvey(s)} />
            ) : selectedQuestion ? (
              <QuestionEditor
                key={selectedQuestion.id}
                question={selectedQuestion}
                surveyId={survey.id}
                onSave={updated => setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q))}
                onClose={() => setSelected('welcome')}
              />
            ) : (
              <p className="text-white/30 text-center pt-20">Select a question to edit it.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
