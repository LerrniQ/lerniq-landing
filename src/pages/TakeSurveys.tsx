import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Radio } from 'lucide-react'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

type Audience = 'all' | 'student' | 'lecturer' | 'course_rep'

interface PublicSurvey {
  id: number
  title: string
  slug: string
  description: string | null
  welcome_description: string | null
  audience: Audience
}

const FILTERS: { value: Audience | ''; label: string }[] = [
  { value: '',           label: 'All' },
  { value: 'student',    label: 'Students' },
  { value: 'lecturer',   label: 'Lecturers' },
  { value: 'course_rep', label: 'Course Reps' },
]

export default function TakeSurveys() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeAudience = (searchParams.get('for') ?? '') as Audience | ''

  const [surveys, setSurveys] = useState<PublicSurvey[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    const url = activeAudience
      ? `${API_URL}/surveys?audience=${activeAudience}`
      : `${API_URL}/surveys`
    axios.get<PublicSurvey[]>(url)
      .then(res => setSurveys(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [activeAudience])

  function setFilter(val: Audience | '') {
    if (val) setSearchParams({ for: val })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">

      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-clash text-[1.4rem] font-bold text-white no-underline">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain" />
          LerniQ
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </header>

      <main className="flex-1 px-[5%] py-12 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">Surveys</span>
          <h1 className="text-4xl font-bold mb-3">Take a survey</h1>
          <p className="text-white/60 text-lg">Share your experience and help us improve.</p>
        </div>

        {/* Audience filter */}
        <div className="flex gap-1 bg-white/[0.05] border border-white/[0.1] rounded-xl p-1 w-fit mb-8">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeAudience === f.value
                  ? 'bg-brand-blue text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-white/40 text-center py-20">Loading surveys…</p>
        )}
        {error && (
          <p className="text-red-400 text-center py-20">Failed to load surveys.</p>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="text-center py-24 text-white/30">
            <Radio size={40} className="mx-auto mb-4 opacity-30" />
            <p>No surveys available right now.</p>
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {surveys.map(s => (
              <Link
                key={s.id}
                to={`/s/${s.slug}`}
                className="group block bg-white/[0.05] border border-white/[0.1] hover:border-white/30 rounded-2xl p-6 transition-all no-underline"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-white group-hover:text-brand-gold transition-colors mb-2">
                      {s.title}
                    </p>
                    {(s.welcome_description || s.description) && (
                      <p className="text-white/50 text-sm line-clamp-2">
                        {s.welcome_description ?? s.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={18} className="text-white/30 group-hover:text-brand-gold mt-0.5 shrink-0 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
