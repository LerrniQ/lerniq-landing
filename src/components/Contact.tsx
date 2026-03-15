import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  reason:  z.string().min(1, 'Please select a reason'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const ref = useScrollReveal<HTMLElement>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (_data: FormData) => {
    // TODO: wire up to API endpoint via axios
    await new Promise((r) => setTimeout(r, 500))
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 6000)
  }

  return (
    <section id="contact" ref={ref} className="scroll-reveal py-24 px-[5%] bg-brand-dark-blue/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">Get in Touch</Badge>
          <h2>Join the <span className="gradient-text">Movement</span></h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Want to invest, volunteer, or be part of something transformative? Let's connect and
            build the future of campus learning together.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-4 bg-green-500/15 border border-green-500/40 rounded-xl text-green-400 text-center font-medium">
            Thank you for your interest! We will get back to you soon.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 space-y-6"
        >
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your full name" {...register('name')} />
            {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number <span className="text-white/40 font-normal">(Optional)</span></Label>
            <Input id="phone" type="tel" placeholder="+234 800 000 0000" {...register('phone')} />
          </div>

          <div>
            <Label htmlFor="reason">I'm interested in…</Label>
            <select
              id="reason"
              className="flex h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white text-base transition-colors focus:outline-none focus:border-brand-blue focus:bg-white/[0.08] [&>option]:bg-brand-dark"
              {...register('reason')}
            >
              <option value="">Select an option</option>
              <option value="invest">I want to invest</option>
              <option value="volunteer">I want to volunteer</option>
              <option value="student">I'm a student and want to contribute</option>
              <option value="lecturer">I'm a lecturer and want to be part of this</option>
              <option value="partnership">Partnership opportunities</option>
              <option value="other">Other</option>
            </select>
            {errors.reason && <p className="mt-1.5 text-sm text-red-400">{errors.reason.message}</p>}
          </div>

          <div>
            <Label htmlFor="message">Message <span className="text-white/40 font-normal">(Optional)</span></Label>
            <Textarea id="message" placeholder="Tell us more..." rows={5} {...register('message')} />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
            <Send size={18} />
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      </div>
    </section>
  )
}
