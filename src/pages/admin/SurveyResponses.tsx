import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Download, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

interface Question { id: number; title: string; position: number }
interface Response  { id: number; ref_id: string | null; answers: Record<string, string | string[]>; submitted_at: string }
interface Survey    { title: string; slug: string }

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function SurveyResponses() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [survey,    setSurvey]    = useState<Survey | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Response[]>([])
  const [loading,   setLoading]   = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    async function load() {
      try {
        const res = await axios.get<{ survey: Survey; questions: Question[]; responses: Response[] }>(
          `${API_URL}/admin/surveys/${id}/responses`,
          { headers: authHeaders() }
        )
        setSurvey(res.data.survey)
        setQuestions(res.data.questions)
        setResponses(res.data.responses)
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
    load()
  }, [id, navigate])

  async function exportExcel() {
    setExporting(true)
    try {
      const res = await axios.get(`${API_URL}/admin/surveys/${id}/responses/export`, {
        headers:      { ...authHeaders(), Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        responseType: 'blob',
      })
      const url = URL.createObjectURL(res.data as Blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = `responses-${survey?.slug ?? id}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white/40">Loading…</div>

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/surveys" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="font-clash font-bold text-lg leading-none">{survey?.title}</p>
            <p className="text-white/40 text-xs">{responses.length} responses</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/surveys/${id}/edit`}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <Edit2 size={15} /> Edit survey
          </Link>
          <Button onClick={exportExcel} disabled={exporting || responses.length === 0} variant="outline">
            <Download size={15} /> {exporting ? 'Exporting…' : 'Export Excel'}
          </Button>
        </div>
      </header>

      <main className="px-[5%] py-10 max-w-full">
        {error && <p className="text-red-400 mb-6">{error}</p>}

        {responses.length === 0 ? (
          <p className="text-center text-white/30 py-24">No responses yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.1]">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/40 text-left bg-white/[0.02]">
                  <th className="px-5 py-3 font-medium sticky left-0 bg-[#0d1117]">Submitted</th>
                  <th className="px-5 py-3 font-medium">Ref ID</th>
                  {questions.map(q => (
                    <th key={q.id} className="px-5 py-3 font-medium max-w-[200px] truncate" title={q.title}>
                      {q.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map(r => (
                  <tr key={r.id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                    <td className="px-5 py-3 text-white/50 sticky left-0 bg-[#0d1117]">
                      {formatDate(r.submitted_at)}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-brand-gold">
                      {r.ref_id ?? '—'}
                    </td>
                    {questions.map(q => {
                      const a = r.answers[String(q.id)]
                      return (
                        <td key={q.id} className="px-5 py-3 text-white/70 max-w-[200px] truncate" title={Array.isArray(a) ? a.join(', ') : a}>
                          {Array.isArray(a) ? a.join(', ') : (a ?? <span className="text-white/20">—</span>)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
