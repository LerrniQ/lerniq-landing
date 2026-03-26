import logoImg from '@/assets/lerniq-logo.png'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  ['about', 'About'],
  ['features', 'Features'],
  ['benefits', 'Benefits'],
  ['contact', 'Contact'],
] as const

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full px-[5%] py-6 bg-brand-dark/90 backdrop-blur-xl border-b border-white/[0.16] z-[1000]"
      style={{ animation: 'slideDown 0.8s ease' }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a
          href="#"
          className="flex items-center gap-2 font-clash text-[1.8rem] font-bold text-white no-underline"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <img src={logoImg} alt="LerniQ Logo" className="w-10 h-10 rounded-lg object-contain" />
          LerniQ
        </a>

        <ul className="hidden md:flex gap-10 list-none items-center">
          {NAV_LINKS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-white font-medium no-underline relative transition-colors duration-300 hover:text-brand-gold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full"
                onClick={(e) => { e.preventDefault(); scrollTo(id) }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <Button
          variant="nav"
          size="nav"
          onClick={() => scrollTo('survey')}
        >
          Take Survey
        </Button>
      </div>
    </nav>
  )
}
