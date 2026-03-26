import {
  Megaphone, Library, CalendarDays, BellRing, MessageSquare, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Feature {
  Icon: LucideIcon
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  { Icon: Megaphone,   title: 'Announcements Board', desc: 'Real-time updates from course reps and lecturers delivered straight to your dashboard' },
  { Icon: Library,     title: 'Materials Library',   desc: 'Upload, download, and organize all course materials in one centralized location' },
  { Icon: CalendarDays,title: 'Smart Calendar',      desc: 'Automated scheduling system that keeps everyone on the same page' },
  { Icon: BellRing,    title: 'Push Notifications',  desc: 'Never miss important updates with instant mobile and web notifications' },
  { Icon: MessageSquare,title:'Course Channels',     desc: 'Dedicated spaces for each course with organized discussions and resources' },
  { Icon: ShieldCheck, title: 'Role-Based Access',   desc: 'Customized permissions ensuring students, reps, and lecturers have the right tools' },
]

export default function Features() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="features" ref={ref} className="scroll-reveal py-24 px-[5%] bg-brand-dark-blue/55">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">Core Features</Badge>
          <h2>How <span className="gradient-text">LerniQ</span> Works</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Everything you need for a seamless academic experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-white/[0.07] border border-white/[0.15] rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.12] hover:border-brand-blue hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center text-sm font-bold text-brand-dark flex-shrink-0">
                  {i + 1}
                </span>
                <div className="w-9 h-9 bg-gradient-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-dark" />
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">{title}</h4>
              <p className="text-white/80 leading-[1.7]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
