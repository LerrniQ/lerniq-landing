import { GraduationCap, Users2, BookUser, Check, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface UserType {
  Icon: LucideIcon
  title: string
  subtitle: string
  items: string[]
}

const USER_TYPES: UserType[] = [
  {
    Icon: GraduationCap,
    title: 'Students',
    subtitle: 'Stay ahead in your academic journey',
    items: [
      'View complete lecture schedules',
      'Access all course materials instantly',
      'Get automatic reminders for classes',
      'Never miss important announcements',
      'Track your academic calendar',
    ],
  },
  {
    Icon: Users2,
    title: 'Course Reps',
    subtitle: 'Lead your class with confidence',
    items: [
      'Create and update lecture schedules',
      'Notify classmates instantly',
      'Upload and organize materials',
      'Coordinate with lecturers easily',
      'Reduce organizational stress',
    ],
  },
  {
    Icon: BookUser,
    title: 'Lecturers',
    subtitle: 'Enhance your teaching experience',
    items: [
      'Upload lecture materials seamlessly',
      'Share schedules automatically',
      'Communicate with class reps',
      'Reduce repetitive questions',
      'Focus more on teaching',
    ],
  },
]

export default function Users() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal py-24 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">Built for You</Badge>
          <h2>Who is <span className="gradient-text">LerniQ</span> For?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Designed specifically for the Nigerian campus community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USER_TYPES.map(({ Icon, title, subtitle, items }) => (
            <div
              key={title}
              className="relative bg-white/[0.09] backdrop-blur-md border border-white/[0.16] rounded-[30px] p-12 overflow-hidden transition-all duration-300 group hover:-translate-y-2 hover:border-brand-gold hover:shadow-[0_25px_70px_rgba(255,198,0,0.15)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-brand before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100"
            >
              <Icon size={52} className="text-brand-gold mb-6" strokeWidth={1.5} />
              <h3 className="text-[1.8rem] font-bold text-brand-gold mb-2">{title}</h3>
              <p className="text-white/80 mb-6">{subtitle}</p>
              <ul className="space-y-0 list-none">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-3 text-white/90 border-b border-white/[0.10] last:border-0"
                  >
                    <Check size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
