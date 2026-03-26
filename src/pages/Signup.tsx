import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Copy, Check, ArrowLeft, GraduationCap, Users2, BookUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not set. Add it to your .env.local file.')
}

const schema = z.object({
  name:   z.string().min(2,  'Name must be at least 2 characters'),
  email:  z.string().email(  'Enter a valid email address'),
  school: z.string().min(2,  'Enter your school name'),
  role:   z.enum(['student', 'course_rep', 'lecturer'], {
    required_error: 'Select your role',
  }),
})
type FormData = z.infer<typeof schema>

const ROLES = [
  { value: 'student',    label: "I'm a Student",    Icon: GraduationCap },
  { value: 'course_rep', label: "I'm a Course Rep",  Icon: Users2 },
  { value: 'lecturer',   label: "I'm a Lecturer",    Icon: BookUser },
] as const

export default function Signup() {
  const [searchParams] = useSearchParams()
  const referredBy = searchParams.get('ref') ?? undefined

  const [referralLink, setReferralLink] = useState<string | null>(null)
  const [copied, setCopied]             = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await axios.post<{ referralLink: string }>(`${API_URL}/signup`, {
        ...data,
        ...(referredBy ? { referredBy } : {}),
      })
      setReferralLink(res.data.referralLink)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.error ?? 'Something went wrong. Try again.')
      } else {
        setServerError('Something went wrong. Try again.')
      }
    }
  }

  const handleCopy = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">

      {/* Minimal header */}
      <header className="px-[5%] py-5 border-b border-white/[0.1] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-clash text-[1.6rem] font-bold text-white no-underline">
          <img src={logoImg} alt="LerniQ" className="w-9 h-9 rounded-lg object-contain" />
          LerniQ
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-center justify-center px-[5%] py-16">
        <div className="w-full max-w-md" style={{ animation: 'fadeInUp 0.8s ease both' }}>

          {referralLink ? (
            /* ── Success state ── */
            <div className="text-center space-y-8">
              <div>
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="mb-3">You're on the list!</h2>
                <p className="text-white/70 text-lg">
                  Share your link below. Every person who signs up through it moves you up the waitlist.
                </p>
              </div>

              <div className="bg-white/[0.09] border border-white/[0.16] rounded-2xl p-6 space-y-4">
                <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Your referral link</p>
                <div className="bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 font-mono text-sm text-brand-gold break-all">
                  {referralLink}
                </div>
                <Button onClick={handleCopy} className="w-full" variant={copied ? 'outline' : 'default'}>
                  {copied ? (
                    <><Check size={16} /> Copied!</>
                  ) : (
                    <><Copy size={16} /> Copy link</>
                  )}
                </Button>
              </div>

              <p className="text-white/40 text-sm">
                Share on WhatsApp, Instagram, anywhere your coursemates hang out.
              </p>
            </div>

          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-10">
                {referredBy && (
                  <div className="mb-6 px-4 py-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-brand-gold text-sm font-medium">
                    Someone invited you — you're joining through a referral link.
                  </div>
                )}
                <span className="inline-block text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
                  Early Access
                </span>
                <h1 className="text-4xl font-bold mb-3">Join the waitlist</h1>
                <p className="text-white/60 text-lg">
                  Be first to know when LerniQ launches on your campus.
                </p>
              </div>

              {serverError && (
                <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Your full name" {...register('name')} />
                  {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="school">School / University</Label>
                  <Input id="school" placeholder="e.g. University of Lagos" {...register('school')} />
                  {errors.school && <p className="mt-1.5 text-sm text-red-400">{errors.school.message}</p>}
                </div>

                <div>
                  <Label>I am a…</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {ROLES.map(({ value, label, Icon }) => (
                      <label
                        key={value}
                        className="relative flex flex-col items-center gap-2 p-3 bg-white/[0.06] border border-white/[0.14] rounded-xl cursor-pointer transition-all duration-200 hover:border-brand-blue has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/10 text-center"
                      >
                        <input type="radio" value={value} className="sr-only" {...register('role')} />
                        <Icon size={22} className="text-white/70" />
                        <span className="text-xs font-medium text-white/80 leading-tight">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.role && <p className="mt-1.5 text-sm text-red-400">{errors.role.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Joining…' : 'Join the waitlist'}
                </Button>

              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
