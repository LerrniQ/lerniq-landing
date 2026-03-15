import { PopupButton } from '@typeform/embed-react'
import { GraduationCap, Users2, BookUser, type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const FORM_IDS = {
  student:   'zNIU6aqw',
  courseRep: 'WxKLXP6u',
  lecturer:  'pxQ8Pmkf',
} as const

interface SurveyOption {
  key: keyof typeof FORM_IDS
  Icon: LucideIcon
  label: string
  sub: string
}

const SURVEYS: SurveyOption[] = [
  { key: 'student',   Icon: GraduationCap, label: "I'm a Student",    sub: 'Share Your Experience' },
  { key: 'courseRep', Icon: Users2,        label: "I'm a Course Rep", sub: 'Tell Us Your Challenges' },
  { key: 'lecturer',  Icon: BookUser,      label: "I'm a Lecturer",   sub: 'Help Us Improve' },
]

export default function Survey() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="survey" ref={ref} className="scroll-reveal py-24 px-[5%] bg-gradient-blue relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-6">Shape the Future with Us</h2>
        <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
          Your feedback is crucial in building a platform that truly serves Nigerian campuses.
          Take a minute to share your experience and help us create something amazing.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          {SURVEYS.map(({ key, Icon, label, sub }) => (
            <PopupButton
              key={key}
              id={FORM_IDS[key]}
              className="group flex flex-col items-center gap-2 px-8 py-6 bg-white/95 hover:bg-white text-brand-blue rounded-2xl font-bold text-lg min-w-[240px] border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <Icon size={34} strokeWidth={1.5} />
              <span className="font-bold">{label}</span>
              <span className="text-sm font-normal text-gray-500">{sub}</span>
            </PopupButton>
          ))}
        </div>
      </div>
    </section>
  )
}
