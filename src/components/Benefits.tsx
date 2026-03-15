import { useState } from 'react'
import {
  Clock, Smartphone, TrendingUp,
  Target, MessageCircle, Bot,
  Zap, BarChart3, RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface BenefitCard {
  Icon: LucideIcon
  title: string
  desc: string
}

interface TabContent {
  label: string
  cards: BenefitCard[]
}

type TabKey = 'students' | 'reps' | 'lecturers'

const TABS: Record<TabKey, TabContent> = {
  students: {
    label: 'For Students',
    cards: [
      { Icon: Clock,       title: 'Never Miss Lectures',     desc: 'Automated reminders and real-time schedule updates keep you informed' },
      { Icon: Smartphone,  title: 'Everything in One Place', desc: 'All materials, schedules, and announcements accessible from your phone' },
      { Icon: TrendingUp,  title: 'Better Planning',         desc: 'View your entire semester at a glance and plan accordingly' },
    ],
  },
  reps: {
    label: 'For Course Reps',
    cards: [
      { Icon: Target,        title: 'Streamlined Organization', desc: 'Manage class information efficiently with intuitive tools' },
      { Icon: MessageCircle, title: 'Easy Communication',       desc: 'Reach your entire class instantly with one announcement' },
      { Icon: Bot,           title: 'Automation',               desc: 'Let the system handle notifications while you focus on coordination' },
    ],
  },
  lecturers: {
    label: 'For Lecturers',
    cards: [
      { Icon: Zap,       title: 'Save Time',       desc: 'Upload materials once and reach all students automatically' },
      { Icon: BarChart3, title: 'Better Engagement',desc: 'Track material access and student participation easily' },
      { Icon: RefreshCw, title: 'Less Repetition', desc: 'Centralized information means fewer repeated questions' },
    ],
  },
}

export default function Benefits() {
  const [active, setActive] = useState<TabKey>('students')
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="benefits" ref={ref} className="scroll-reveal py-24 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">What You Gain</Badge>
          <h2>Benefits for <span className="gradient-text">Everyone</span></h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {(Object.keys(TABS) as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                'px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 cursor-pointer border-2',
                active === key
                  ? 'bg-gradient-brand text-white border-transparent'
                  : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-brand-gold',
              )}
            >
              {TABS[key].label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          key={active}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ animation: 'fadeInUp 0.5s ease' }}
        >
          {TABS[active].cards.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-3xl p-10 transition-all duration-300 hover:scale-105 hover:border-brand-gold hover:shadow-[0_15px_50px_rgba(255,198,0,0.2)]"
            >
              <Icon size={36} className="text-brand-gold mb-4" strokeWidth={1.5} />
              <h4 className="text-2xl font-semibold mb-3">{title}</h4>
              <p className="text-white/70 leading-[1.7]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
