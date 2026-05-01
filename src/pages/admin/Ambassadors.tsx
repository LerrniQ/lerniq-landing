import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  Plus, Trash2, ArrowLeft, Copy, Check,
  BarChart2, Download, Users, ChevronDown, ChevronUp, Link2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  response_count: number
  created_at: string
}

interface Survey {
  id: number
  title: string
  slug: string
  published: boolean
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Copy button (self-contained feedback state) ────────────────────────────────
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs transition-colors ${
        copied ? 'text-green-400' : 'text-white/50 hover:text-white'
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  )
}

// ── Survey links panel (expandable) ───────────────────────────────────────────
function SurveyLinks({ ambassador, surveys }: { ambassador: Ambassador; surveys: Survey[] }) {
  const [open, setOpen] = useState(false)
  const published = surveys.filter(s => s.published)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:text-white transition-colors font-medium"
      >
        <Link2 size={14} />
        Survey links
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 pl-1">
          {published.length === 0 ? (
            <p className="text-white/30 text-xs">No published surveys yet.</p>
          ) : (
            published.map(s => {
              const link = `${window.location.origin}/s/${s.slug}?ref=${ambassador.ref_id}`
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 bg-white/[0.04] rounded-lg px-3 py-2">
                  <span className="text-sm text-white/70 truncate flex-1">{s.title}</span>
                  <CopyBtn text={link} label="Copy" />
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Ambassadors() {
  const navigate = useNavigate()

  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [surveys,     setSurveys]     = useState<Survey[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [creating,    setCreating]    = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [exporting,   setExporting]   = useState(false)

  const [form, setForm] = useState({ name: '', email: '', phone: '', school: '' })

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { navigate('/admin'); return }
    load()
  }, [navigate])

  async function load() {
    setLoading(true)
    try {
      const headers = authHeaders()
      const [ambRes, survRes] = await Promise.all([
        axios.get<Ambassador[]>(`${API_URL}/admin/ambassadors`, { headers }),
        axios.get<Survey[]>(`${API_URL}/admin/surveys`,          { headers }),
      ])
      setAmbassadors(ambRes.data)
      setSurveys(survRes.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('admin_token'); navigate('/admin')
      } else {
        setError('Failed to load data.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function create() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const res = await axios.post<Ambassador>(
        `${API_URL}/admin/ambassadors`,
        { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), school: form.school.trim() },
        { headers: authHeaders() }
      )
      setAmbassadors(prev => [res.data, ...prev])
      setForm({ name: '', email: '', phone: '', school: '' })
      setCreating(false)
    } catch {
      setError('Failed to create ambassador.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this ambassador? Their past response attributions will be cleared.')) return
    await axios.delete(`${API_URL}/admin/ambassadors/${id}`, { headers: authHeaders() })
    setAmbassadors(prev => prev.filter(a => a.id !== id))
  }

  async function exportAll() {
    setExporting(true)
    try {
      const res = await axios.get(`${API_URL}/admin/ambassadors/export/all`, {
        headers: authHeaders(), responseType: 'blob',
      })
      const url  = URL.createObjectURL(res.data as Blob)
      const link = document.createElement('a')
      link.href = url; link.download = 'all-ambassador-responses.xlsx'; link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  const totalResponses = ambassadors.reduce((s, a) => s + a.response_count, 0)

  return (
    <div className="min-h-screen bg-brand-dark text-white">

      {/* Header */}
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain shrink-0" />
          <div className="min-w-0">
            <p className="font-clash font-bold text-lg leading-none">LerniQ</p>
            <p className="text-white/40 text-xs">Ambassadors</p>
          </div>
        </div>
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap shrink-0">
          <ArrowLeft size={15} /> Dashboard
        </Link>
      </header>

      <main className="px-[5%] py-8 max-w-5xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8 sm:max-w-xs">
          {[
            { label: 'Ambassadors',     value: ambassadors.length },
            { label: 'Total referrals', value: totalResponses },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4">
              <p className="text-white/50 text-xs mb-1">{label}</p>
              <p className="font-clash font-bold text-3xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-clash font-bold text-xl sm:text-2xl">All ambassadors</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportAll} disabled={exporting || ambassadors.length === 0} className="text-sm">
              <Download size={14} /> {exporting ? 'Exporting…' : 'Export all'}
            </Button>
            <Button onClick={() => setCreating(true)} disabled={creating} className="text-sm">
              <Plus size={14} /> Add ambassador
            </Button>
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <div className="mb-6 bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 space-y-4">
            <p className="font-semibold">New ambassador</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amb-name">Full name <span className="text-red-400">*</span></Label>
                <Input id="amb-name" placeholder="e.g. Chidi Okeke" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && create()}
                  autoFocus />
              </div>
              <div>
                <Label htmlFor="amb-phone">Phone number</Label>
                <Input id="amb-phone" placeholder="+2348012345678" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="amb-email">Email <span className="text-white/30 font-normal">(optional)</span></Label>
                <Input id="amb-email" type="email" placeholder="chidi@uni.edu" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="amb-school">School <span className="text-white/30 font-normal">(optional)</span></Label>
                <Input id="amb-school" placeholder="University of Lagos" value={form.school}
                  onChange={e => setForm(p => ({ ...p, school: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={create} disabled={saving || !form.name.trim()}>
                {saving ? 'Creating…' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => { setCreating(false); setForm({ name: '', email: '', phone: '', school: '' }) }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 mb-6 text-sm">{error}</p>}

        {loading ? (
          <p className="text-white/40 py-20 text-center">Loading…</p>
        ) : ambassadors.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Users size={40} className="mx-auto mb-4 opacity-30" />
            <p>No ambassadors yet. Add your first one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ambassadors.map(a => (
              <div key={a.id} className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 space-y-4">

                {/* Top row — name + actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-lg leading-tight truncate">{a.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-brand-gold">{a.ref_id}</span>
                      <CopyBtn text={a.ref_id} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`font-clash font-bold text-xl mr-2 ${a.response_count > 0 ? 'text-brand-gold' : 'text-white/20'}`}>
                      {a.response_count}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/ambassadors/${a.id}/responses`)}
                      className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
                      title="View responses"
                    >
                      <BarChart2 size={16} />
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      className="p-2 text-white/50 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.06]"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Contact + school */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/50">
                  {a.phone  && <span>{a.phone}</span>}
                  {a.email  && <span>{a.email}</span>}
                  {a.school && <span>{a.school}</span>}
                  <span className="text-white/30">Added {formatDate(a.created_at)}</span>
                </div>

                {/* Survey links */}
                <SurveyLinks ambassador={a} surveys={surveys} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
