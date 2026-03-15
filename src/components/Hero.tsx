import { BookOpen, Calendar, Bell, Users, ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type LucideIcon } from 'lucide-react'

interface FeatureCard {
  Icon: LucideIcon
  title: string
  desc: string
}

const FEATURE_CARDS: FeatureCard[] = [
  { Icon: BookOpen, title: 'Access Materials',  desc: 'All your lecture notes in one place' },
  { Icon: Calendar, title: 'Track Schedules',   desc: 'Never miss an important class' },
  { Icon: Bell,     title: 'Get Notified',       desc: 'Real-time updates from course reps' },
  { Icon: Users,    title: 'Stay Connected',     desc: 'Seamless lecturer-student communication' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-32 pb-16 px-[5%] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* Content */}
        <div style={{ animation: 'fadeInUp 1s ease' }}>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold rounded-full text-brand-gold text-sm font-semibold mb-6"
            style={{ animation: 'fadeInUp 1s ease 0.2s both' }}
          >
            <GraduationCap size={16} />
            Built for Nigerian Campuses
          </span>

          <h1 style={{ animation: 'fadeInUp 1s ease 0.4s both' }}>
            Smarter Learning for<br />
            <span className="gradient-text">Smarter Campuses</span>
          </h1>

          <p
            className="text-xl text-white/70 mb-10 leading-[1.8]"
            style={{ animation: 'fadeInUp 1s ease 0.6s both' }}
          >
            A digital platform helping students, lecturers, and course reps coordinate
            academic life effortlessly. Never miss a lecture, always have your materials,
            and stay connected.
          </p>

          <div
            className="flex gap-4 flex-wrap"
            style={{ animation: 'fadeInUp 1s ease 0.8s both' }}
          >
            <Button onClick={() => scrollTo('survey')}>
              Take the Survey <ArrowRight size={18} />
            </Button>
            <Button variant="outline" onClick={() => scrollTo('about')}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Visual cards */}
        <div style={{ animation: 'fadeInUp 1s ease 0.6s both' }}>
          <div className="grid grid-cols-2 gap-4">
            {FEATURE_CARDS.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-brand-blue"
                style={{ animation: 'fadeInUp 1s ease both', animationDelay: `${0.8 + i * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-[1.05rem] mb-1">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
