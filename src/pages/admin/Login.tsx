import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoImg from '@/assets/lerniq-logo.png'

const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('VITE_API_URL is not set.')

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})
type FormData = z.infer<typeof schema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await axios.post<{ token: string }>(`${API_URL}/auth/login`, data)
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.error ?? 'Login failed.')
      } else {
        setServerError('Something went wrong.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center px-[5%]">
      <div className="w-full max-w-sm" style={{ animation: 'fadeInUp 0.8s ease both' }}>

        <div className="text-center mb-10">
          <img src={logoImg} alt="LerniQ" className="w-12 h-12 rounded-xl object-contain mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-1">Admin Login</h2>
          <p className="text-white/50 text-sm">LerniQ internal dashboard</p>
        </div>

        {serverError && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@lerniq.org" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            <Lock size={15} />
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
