import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Copy, Check, ArrowLeft, ExternalLink } from 'lucide-react'
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
  phone:  z.string().min(7,  'Enter a valid phone number'),
  email:  z.string().email('Enter a valid email address').optional().or(z.literal('')),
  school: z.string().min(2,  'Enter your school name'),
})
type FormData = z.infer<typeof schema>

export default function CourseRep() {
  const [typeformLink, setTypeformLink] = useState<string | null>(null)
  const [copied, setCopied]             = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)
  const [returning, setReturning]       = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await axios.post<{ typeformLink: string; returning?: boolean }>(
        `${API_URL}/course-rep`,
        data
      )
      setTypeformLink(res.data.typeformLink)
      setReturning(res.data.returning ?? false)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.error ?? 'Something went wrong. Try again.')
      } else {
        setServerError('Something went wrong. Try again.')
      }
    }
  }

  const handleCopy = () => {
    if (!typeformLink) return
    navigator.clipboard.writeText(typeformLink)
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

          {typeformLink ? (
            /* ── Success state ── */
            <div className="text-center space-y-8">
              <div>
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="mb-3">
                  {returning ? 'Welcome back!' : "You're registered!"}
                </h2>
                <p className="text-white/70 text-lg">
                  Share this link with your lecturers. Every time one of them submits the survey, it gets recorded against your account.
                </p>
              </div>

              <div className="bg-white/[0.09] border border-white/[0.16] rounded-2xl p-6 space-y-4">
                <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Lecturer survey link</p>
                <div className="bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 font-mono text-sm text-brand-gold break-all">
                  {typeformLink}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleCopy} variant={copied ? 'outline' : 'default'}>
                    {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy link</>}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(typeformLink, '_blank')}
                  >
                    <ExternalLink size={15} /> Preview
                  </Button>
                </div>
              </div>

              <p className="text-white/40 text-sm">
                Send it over WhatsApp, email, or however you reach your lecturers.
              </p>
            </div>

          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-10">
                <span className="inline-block text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
                  Course Reps
                </span>
                <h1 className="text-4xl font-bold mb-3">Get your lecturer link</h1>
                <p className="text-white/60 text-lg">
                  Register once, get a personalised survey link to share with your lecturers.
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
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+234 800 000 0000" {...register('phone')} />
                  {errors.phone && <p className="mt-1.5 text-sm text-red-400">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">
                    Email address{' '}
                    <span className="text-white/40 font-normal">(optional)</span>
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="school">School / University</Label>
                  <Input id="school" placeholder="e.g. University of Lagos" {...register('school')} />
                  {errors.school && <p className="mt-1.5 text-sm text-red-400">{errors.school.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Generating link…' : 'Get my lecturer link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
