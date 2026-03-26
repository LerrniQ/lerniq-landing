import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogOut, Users2, GraduationCap, BookUser, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

type Tab = 'waitlist' | 'course-reps'

interface WaitlistUser {
  name: string
  email: string
  school: string
  role: string
  ref_id: string
  referred_by: string | null
  referral_count: number
  created_at: string
}

interface CourseRep {
  name: string
  email: string
  school: string
  ref_id: string
  referral_count: number
  created_at: string
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const ROLE_BADGE: Record<string, string> = {
  student:    'bg-brand-blue/20 text-blue-300',
  course_rep: 'bg-brand-gold/20 text-yellow-300',
  lecturer:   'bg-purple-500/20 text-purple-300',
}

export default function Dashboard() {
  const navigate  = useNavigate()
  const [tab, setTab]           = useState<Tab>('waitlist')
  const [waitlist, setWaitlist] = useState<WaitlistUser[]>([])
  const [reps, setReps]         = useState<CourseRep[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin'); return }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const headers = authHeaders()
        const [wRes, rRes] = await Promise.all([
          axios.get<WaitlistUser[]>(`${API_URL}/admin/waitlist`,     { headers }),
          axios.get<CourseRep[]>  (`${API_URL}/admin/course-reps`,   { headers }),
        ])
        setWaitlist(wRes.data)
        setReps(rRes.data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('admin_token')
          navigate('/admin')
        } else {
          setError('Failed to load data.')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  const totalReferrals = reps.reduce((sum, r) => sum + r.referral_count, 0)

  return (
    <div className="min-h-screen bg-brand-dark text-white">

      {/* Header */}
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <p className="font-clash font-bold text-lg leading-none">LerniQ</p>
            <p className="text-white/40 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut size={15} /> Sign out
        </Button>
      </header>

      <main className="px-[5%] py-10 max-w-7xl mx-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Waitlist total',    value: waitlist.length,    Icon: GraduationCap },
            { label: 'Course reps',       value: reps.length,        Icon: Users2 },
            { label: 'Lecturer referrals',value: totalReferrals,     Icon: BookUser },
            { label: 'Conversion rate',
              value: reps.length > 0 ? `${Math.round((totalReferrals / reps.length) * 10) / 10}×` : '—',
              Icon: TrendingUp },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                <Icon size={15} /> {label}
              </div>
              <p className="font-clash font-bold text-3xl">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.05] border border-white/[0.1] rounded-xl p-1 w-fit mb-6">
          {(['waitlist', 'course-reps'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? 'bg-brand-blue text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t === 'waitlist' ? 'Waitlist' : 'Course Reps'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="text-white/40 py-20 text-center">Loading…</div>
        )}
        {error && (
          <div className="text-red-400 py-10 text-center">{error}</div>
        )}

        {!loading && !error && tab === 'waitlist' && (
          <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08]">
              <p className="font-semibold">{waitlist.length} signups</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-white/40 text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">School</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Referrals</th>
                    <th className="px-6 py-3 font-medium">Referred by</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((u) => (
                    <tr key={u.ref_id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-white/60">{u.email}</td>
                      <td className="px-6 py-4 text-white/60">{u.school}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${ROLE_BADGE[u.role] ?? 'bg-white/10 text-white/60'}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{u.referral_count}</td>
                      <td className="px-6 py-4 text-white/40 font-mono text-xs">{u.referred_by ?? '—'}</td>
                      <td className="px-6 py-4 text-white/40">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {waitlist.length === 0 && (
                <p className="text-center text-white/30 py-12">No signups yet.</p>
              )}
            </div>
          </div>
        )}

        {!loading && !error && tab === 'course-reps' && (
          <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08]">
              <p className="font-semibold">{reps.length} course reps registered</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-white/40 text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">School</th>
                    <th className="px-6 py-3 font-medium">Ref ID</th>
                    <th className="px-6 py-3 font-medium">Lecturer submissions</th>
                    <th className="px-6 py-3 font-medium">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {reps.map((r) => (
                    <tr key={r.ref_id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                      <td className="px-6 py-4 font-medium">{r.name}</td>
                      <td className="px-6 py-4 text-white/60">{r.email}</td>
                      <td className="px-6 py-4 text-white/60">{r.school}</td>
                      <td className="px-6 py-4 font-mono text-xs text-brand-gold">{r.ref_id}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-base ${r.referral_count > 0 ? 'text-brand-gold' : 'text-white/30'}`}>
                          {r.referral_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40">{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reps.length === 0 && (
                <p className="text-center text-white/30 py-12">No course reps yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
