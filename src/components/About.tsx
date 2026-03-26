import { XCircle, CheckCircle2, Rocket, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface AboutCard {
  Icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  text: string
}

const CARDS: AboutCard[] = [
  {
    Icon: XCircle,
    iconBg: 'bg-red-500/15 border border-red-500/30',
    iconColor: 'text-red-400',
    title: 'The Problem',
    text: 'Students miss lectures due to poor communication. Learning materials are scattered across multiple platforms. Course scheduling is manual and uncoordinated. The relationship between students, reps, and lecturers is often disconnected.',
  },
  {
    Icon: CheckCircle2,
    iconBg: 'bg-green-500/15 border border-green-500/30',
    iconColor: 'text-green-400',
    title: 'The Solution',
    text: 'LerniQ centralizes everything academic. One platform for schedules, materials, announcements, and communication. Course reps can easily update information, lecturers can share resources, and students stay informed automatically.',
  },
  {
    Icon: Rocket,
    iconBg: 'bg-brand-gold/15 border border-brand-gold/30',
    iconColor: 'text-brand-gold',
    title: 'The Vision',
    text: 'To strengthen the academic experience on Nigerian campuses by building digital tools that make communication, learning, and coordination seamless for everyone involved in the educational journey.',
  },
]

export default function About() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="about" ref={ref} className="scroll-reveal py-24 px-[5%] bg-brand-dark-blue/55">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">About LerniQ</Badge>
          <h2>What is <span className="gradient-text">LerniQ</span>?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A digital academic support system that helps students, course reps, and lecturers manage
            lectures, learning resources, schedules, and communication more effectively in Nigerian
            tertiary institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map(({ Icon, iconBg, iconColor, title, text }) => (
            <div
              key={title}
              className="bg-white/[0.07] border border-white/[0.15] rounded-3xl p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.11] hover:border-brand-blue hover:shadow-[0_20px_60px_rgba(46,63,226,0.2)]"
            >
              <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon size={28} className={iconColor} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{title}</h3>
              <p className="text-white/80 leading-[1.8]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
