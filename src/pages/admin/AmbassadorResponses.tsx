import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

interface Ambassador {
  id: number
  name: string
  email: string | null
  phone: string | null
  school: string | null
  ref_id: string
}

interface Question {
  id: number
  title: string
}

interface SurveyResponse {
  id: number
  survey_id: number
  survey_title: string
  survey_slug: string
  submitted_at: string
  answers: Record<string, string | string[]>
}

interface ResponseData {
  ambassador: Ambassador
  responses: SurveyResponse[]
  questions_by_survey: Record<number, Question[]>
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AmbassadorResponses() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [data,      setData]      = useState<ResponseData | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    load()
  }, [id, navigate])

  async function load() {
    setLoading(true)
    try {
      const res = await axios.get<ResponseData>(
        `${API_URL}/admin/ambassadors/${id}/responses`,
        { headers: authHeaders() }
      )
      setData(res.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('admin_token'); navigate('/admin')
      } else {
        setError('Failed to load responses.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function exportXlsx() {
    setExporting(true)
    try {
      const res = await axios.get(
        `${API_URL}/admin/ambassadors/${id}/responses/export`,
        { headers: authHeaders(), responseType: 'blob' }
      )
      const url  = URL.createObjectURL(res.data as Blob)
      const link = document.createElement('a')
      link.href     = url
      link.download = `ambassador-${data?.ambassador.ref_id ?? id}.xlsx`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-brand-dark" />
  if (error || !data) return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
      <p className="text-red-400">{error ?? 'Not found.'}</p>
    </div>
  )

  const { ambassador, responses, questions_by_survey } = data
  const surveyIds = [...new Set(responses.map(r => r.survey_id))]

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <p className="font-clash font-bold text-lg leading-none">LerniQ</p>
            <p className="text-white/40 text-xs">Ambassador Responses</p>
          </div>
        </div>
        <Link to="/admin/ambassadors" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Ambassadors
        </Link>
      </header>

      <main className="px-[5%] py-10 max-w-6xl mx-auto">

        {/* Ambassador info card */}
        <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-clash font-bold text-2xl mb-1">{ambassador.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-white/50">
              <span className="font-mono text-brand-gold">{ambassador.ref_id}</span>
              {ambassador.phone  && <span>{ambassador.phone}</span>}
              {ambassador.email  && <span>{ambassador.email}</span>}
              {ambassador.school && <span>{ambassador.school}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-clash font-bold text-3xl text-brand-gold">{responses.length}</p>
              <p className="text-white/40 text-xs">total responses</p>
            </div>
            <Button onClick={exportXlsx} disabled={exporting || responses.length === 0} variant="outline">
              <Download size={15} /> {exporting ? 'Exporting…' : 'Export Excel'}
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <p className="text-white/30 text-center py-20">No responses via this ambassador yet.</p>
        ) : (
          <div className="space-y-10">
            {surveyIds.map(sid => {
              const surveyResponses = responses.filter(r => r.survey_id === sid)
              const questions       = questions_by_survey[sid] ?? []
              const surveyTitle     = surveyResponses[0]?.survey_title ?? `Survey ${sid}`

              return (
                <div key={sid}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{surveyTitle}</h3>
                    <span className="text-white/40 text-sm">{surveyResponses.length} response{surveyResponses.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" style={{ minWidth: `${Math.max(600, (questions.length + 2) * 160)}px` }}>
                        <thead>
                          <tr className="border-b border-white/[0.08] text-white/40 text-left">
                            <th className="px-5 py-3 font-medium whitespace-nowrap sticky left-0 bg-[#0e0e14]">Submitted</th>
                            {questions.map(q => (
                              <th key={q.id} className="px-5 py-3 font-medium whitespace-nowrap max-w-[200px] truncate">{q.title}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {surveyResponses.map(r => (
                            <tr key={r.id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                              <td className="px-5 py-3 text-white/40 whitespace-nowrap sticky left-0 bg-[#0e0e14]">
                                {formatDate(r.submitted_at)}
                              </td>
                              {questions.map(q => {
                                const ans = r.answers[String(q.id)]
                                return (
                                  <td key={q.id} className="px-5 py-3 text-white/80 max-w-[200px]">
                                    {Array.isArray(ans) ? ans.join(', ') : (ans ?? <span className="text-white/20">—</span>)}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
