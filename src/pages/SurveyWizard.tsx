import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

type QuestionType =
  | 'short_text' | 'long_text' | 'multiple_choice' | 'checkboxes'
  | 'yes_no' | 'scale' | 'email' | 'phone' | 'number'

interface Question {
  id: number
  type: QuestionType
  title: string
  description: string | null
  required: boolean
  options: string[] | { min: number; max: number; minLabel?: string; maxLabel?: string } | null
}

interface SurveyData {
  id: number
  title: string
  slug: string
  welcome_title: string | null
  welcome_description: string | null
  welcome_button_text: string
  preview: boolean
  questions: Question[]
}

type Step = 'welcome' | number | 'done'
type Direction = 'forward' | 'backward'

// ── Question input renderer ───────────────────────────────────────────────────
function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string | string[]
  onChange: (v: string | string[]) => void
}) {
  const strVal  = typeof value === 'string' ? value : ''
  const arrVal  = Array.isArray(value) ? value : []

  switch (question.type) {
    case 'short_text':
    case 'email':
    case 'phone':
    case 'number':
      return (
        <input
          type={question.type === 'short_text' ? 'text' : question.type}
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your answer…"
          className="w-full bg-transparent border-b-2 border-white/30 focus:border-brand-gold py-3 text-xl text-white placeholder:text-white/30 outline-none transition-colors"
          autoFocus
        />
      )

    case 'long_text':
      return (
        <textarea
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your answer…"
          rows={4}
          className="w-full bg-white/[0.05] border border-white/[0.15] focus:border-brand-gold rounded-xl p-4 text-white placeholder:text-white/30 outline-none resize-none transition-colors text-lg"
          autoFocus
        />
      )

    case 'multiple_choice': {
      const opts = question.options as string[]
      return (
        <div className="space-y-3">
          {opts.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-lg transition-all ${
                strVal === opt
                  ? 'border-brand-gold bg-brand-gold/10 text-white'
                  : 'border-white/[0.15] hover:border-white/40 text-white/70 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )
    }

    case 'checkboxes': {
      const opts = question.options as string[]
      return (
        <div className="space-y-3">
          {opts.map(opt => {
            const checked = arrVal.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => onChange(checked ? arrVal.filter(v => v !== opt) : [...arrVal, opt])}
                className={`w-full text-left px-5 py-4 rounded-xl border text-lg transition-all flex items-center gap-3 ${
                  checked
                    ? 'border-brand-gold bg-brand-gold/10 text-white'
                    : 'border-white/[0.15] hover:border-white/40 text-white/70 hover:text-white'
                }`}
              >
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  checked ? 'border-brand-gold bg-brand-gold' : 'border-white/30'
                }`}>
                  {checked && <Check size={12} className="text-black" />}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      )
    }

    case 'yes_no':
      return (
        <div className="flex gap-4">
          {['Yes', 'No'].map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex-1 py-5 text-xl font-semibold rounded-xl border transition-all ${
                strVal === opt
                  ? 'border-brand-gold bg-brand-gold/10 text-white'
                  : 'border-white/[0.15] hover:border-white/40 text-white/70 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )

    case 'scale': {
      const { min, max, minLabel, maxLabel } = question.options as {
        min: number; max: number; minLabel?: string; maxLabel?: string
      }
      const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      return (
        <div>
          <div className="flex flex-wrap gap-2">
            {nums.map(n => (
              <button
                key={n}
                onClick={() => onChange(String(n))}
                className={`w-12 h-12 rounded-xl border text-lg font-semibold transition-all ${
                  strVal === String(n)
                    ? 'border-brand-gold bg-brand-gold/10 text-white'
                    : 'border-white/[0.15] hover:border-white/40 text-white/70'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {(minLabel || maxLabel) && (
            <div className="flex justify-between text-sm text-white/40 mt-3 px-1">
              <span>{minLabel}</span>
              <span>{maxLabel}</span>
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export default function SurveyWizard() {
  const { slug }     = useParams<{ slug: string }>()
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const token        = params.get('token') ?? undefined
  const ref          = params.get('ref')   ?? undefined

  const [survey,    setSurvey]    = useState<SurveyData | null>(null)
  const [step,      setStep]      = useState<Step>('welcome')
  const [direction, setDirection] = useState<Direction>('forward')
  const [answers,   setAnswers]   = useState<Record<string, string | string[]>>({})
  const [error,     setError]     = useState<string | null>(null)
  const [required,  setRequired]  = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [loadError,    setLoadError]    = useState(false)
  const [countdown,    setCountdown]    = useState(5)

  useEffect(() => {
    if (step !== 'done') return
    const interval = setInterval(() => setCountdown(c => c - 1), 1000)
    const timeout  = setTimeout(() => navigate('/'), 5000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [step, navigate])

  useEffect(() => {
    async function load() {
      try {
        const url = token
          ? `${API_URL}/surveys/${slug}?token=${token}`
          : `${API_URL}/surveys/${slug}`
        const res = await axios.get<SurveyData>(url)
        setSurvey(res.data)
      } catch {
        setLoadError(true)
      }
    }
    load()
  }, [slug, token])

  if (loadError) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">This survey doesn't exist or isn't available.</p>
          <Link to="/" className="text-brand-blue hover:underline text-sm">Go home</Link>
        </div>
      </div>
    )
  }

  if (!survey) {
    return <div className="min-h-screen bg-brand-dark" />
  }

  const questions    = survey.questions
  const currentIndex = typeof step === 'number' ? step : -1
  const question     = currentIndex >= 0 ? questions[currentIndex] : null
  const progress     = step === 'done' ? 100 : typeof step === 'number' ? Math.round((step / questions.length) * 100) : 0

  function go(nextStep: Step, dir: Direction) {
    setDirection(dir)
    setRequired(false)
    setError(null)
    setStep(nextStep)
  }

  function next() {
    if (question) {
      const ans = answers[String(question.id)]
      const isEmpty = !ans || (Array.isArray(ans) && ans.length === 0) || ans === ''
      if (question.required && isEmpty) { setRequired(true); return }
    }
    const nextIndex = currentIndex + 1
    go(nextIndex < questions.length ? nextIndex : 'done', 'forward')
    if (nextIndex >= questions.length) submit()
  }

  function back() {
    if (currentIndex <= 0) { go('welcome', 'backward'); return }
    go(currentIndex - 1, 'backward')
  }

  async function submit() {
    setSubmitting(true)
    try {
      await axios.post(`${API_URL}/surveys/${slug}/respond`, { answers, ref })
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const animClass = direction === 'forward' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left'
  const stepKey   = String(step)

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">

      {survey.preview && (
        <div className="bg-brand-gold/10 border-b border-brand-gold/30 text-brand-gold text-xs text-center py-2 font-medium">
          Preview mode — responses submitted here are recorded
        </div>
      )}

      {/* Progress bar */}
      {step !== 'welcome' && step !== 'done' && (
        <div className="h-1 bg-white/[0.08] shrink-0">
          <div
            className="h-full bg-brand-blue transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="px-[5%] py-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2 font-clash font-bold text-lg text-white no-underline">
          <img src={logoImg} alt="LerniQ" className="w-8 h-8 rounded-lg object-contain" />
          LerniQ
        </Link>
        {step !== 'welcome' && step !== 'done' && (
          <span className="text-white/30 text-sm">{currentIndex + 1} / {questions.length}</span>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-[5%] py-16">
        <div className="w-full max-w-xl">

          {/* ── Welcome ── */}
          {step === 'welcome' && (
            <div key="welcome" className={animClass} style={{ animation: undefined }}>
              <div style={{ animation: 'fadeInUp 0.6s ease both' }}>
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-4 block">
                  {survey.title}
                </span>
                <h1 className="mb-4">{survey.welcome_title || survey.title}</h1>
                {survey.welcome_description && (
                  <p className="text-white/60 text-lg mb-10">{survey.welcome_description}</p>
                )}
                <Button
                  onClick={() => go(questions.length > 0 ? 0 : 'done', 'forward')}
                  className="px-10"
                >
                  {survey.welcome_button_text} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ── Question ── */}
          {typeof step === 'number' && question && (
            <div key={stepKey} className={animClass}>
              <p className="text-brand-gold text-sm font-semibold mb-2">
                {currentIndex + 1} →
              </p>
              <h2 className="text-2xl font-bold mb-2 leading-snug">{question.title}</h2>
              {question.description && (
                <p className="text-white/50 mb-8">{question.description}</p>
              )}

              <QuestionInput
                question={question}
                value={answers[String(question.id)] ?? (
                  question.type === 'checkboxes' ? [] : ''
                )}
                onChange={val => setAnswers(prev => ({ ...prev, [String(question.id)]: val }))}
              />

              {required && (
                <p className="text-red-400 text-sm mt-3">This question is required.</p>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-3">{error}</p>
              )}

              <div className="flex items-center justify-between mt-10">
                <button
                  onClick={back}
                  className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <Button onClick={next} disabled={submitting}>
                  {currentIndex < questions.length - 1 ? (
                    <>Next <ArrowRight size={15} /></>
                  ) : submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div key="done" className={animClass}>
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img src={logoImg} alt="LerniQ" className="w-12 h-12 rounded-xl object-contain" />
                  <span className="font-clash font-bold text-2xl">LerniQ</span>
                </div>
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <div>
                  <h2 className="mb-2">Thank you!</h2>
                  <p className="text-white/60 text-lg">Your response has been recorded.</p>
                </div>
                <p className="text-white/30 text-sm">
                  Redirecting to home in {countdown}s…{' '}
                  <button onClick={() => navigate('/')} className="text-brand-blue hover:underline">
                    Go now
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
