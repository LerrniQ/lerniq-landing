import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Plus, Edit2, BarChart2, Trash2, ArrowLeft, Radio, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

interface Survey {
  id: number
  title: string
  slug: string
  published: boolean
  question_count: number
  response_count: number
  created_at: string
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Surveys() {
  const navigate = useNavigate()
  const [surveys, setSurveys]   = useState<Survey[]>([])
  const [loading, setLoading]   = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`${window.location.origin}/s/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    load()
  }, [navigate])

  async function load() {
    setLoading(true)
    try {
      const res = await axios.get<Survey[]>(`${API_URL}/admin/surveys`, { headers: authHeaders() })
      setSurveys(res.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('admin_token'); navigate('/admin')
      } else {
        setError('Failed to load surveys.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function createSurvey() {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await axios.post<Survey>(
        `${API_URL}/admin/surveys`,
        { title: newTitle.trim() },
        { headers: authHeaders() }
      )
      navigate(`/admin/surveys/${res.data.id}/edit`)
    } catch {
      setError('Failed to create survey.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSurvey(id: number) {
    if (!confirm('Delete this survey and all its responses? This cannot be undone.')) return
    await axios.delete(`${API_URL}/admin/surveys/${id}`, { headers: authHeaders() })
    setSurveys(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <p className="font-clash font-bold text-lg leading-none">LerniQ</p>
            <p className="text-white/40 text-xs">Surveys</p>
          </div>
        </div>
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Dashboard
        </Link>
      </header>

      <main className="px-[5%] py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-clash font-bold text-2xl">All surveys</h2>
          <Button onClick={() => setCreating(true)} disabled={creating}>
            <Plus size={16} /> New survey
          </Button>
        </div>

        {/* New survey form */}
        {creating && (
          <div className="mb-6 bg-white/[0.05] border border-white/[0.1] rounded-2xl p-6 space-y-4">
            <p className="font-semibold">Create survey</p>
            <div>
              <Label htmlFor="new-title">Survey title</Label>
              <Input
                id="new-title"
                placeholder="e.g. Lecturer Interest Survey"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createSurvey()}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={createSurvey} disabled={saving || !newTitle.trim()}>
                {saving ? 'Creating…' : 'Create & edit'}
              </Button>
              <Button variant="outline" onClick={() => { setCreating(false); setNewTitle('') }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {loading ? (
          <p className="text-white/40 py-20 text-center">Loading…</p>
        ) : surveys.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Radio size={40} className="mx-auto mb-4 opacity-30" />
            <p>No surveys yet. Create your first one.</p>
          </div>
        ) : (
          <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/40 text-left">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Questions</th>
                  <th className="px-6 py-3 font-medium text-center">Responses</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map(s => (
                  <tr key={s.id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                    <td className="px-6 py-4 font-medium">{s.title}</td>
                    <td className="px-6 py-4 font-mono text-xs text-white/50">{s.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        s.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {s.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60">{s.question_count}</td>
                    <td className="px-6 py-4 text-center text-white/60">{s.response_count}</td>
                    <td className="px-6 py-4 text-white/40">{formatDate(s.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyLink(s.slug)}
                          className={`transition-colors ${copiedSlug === s.slug ? 'text-green-400' : 'text-white/50 hover:text-white'}`}
                          title="Copy public link"
                        >
                          {copiedSlug === s.slug ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/surveys/${s.id}/edit`)}
                          className="text-white/50 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/surveys/${s.id}/responses`)}
                          className="text-white/50 hover:text-white transition-colors"
                          title="Responses"
                        >
                          <BarChart2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteSurvey(s.id)}
                          className="text-white/50 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
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
