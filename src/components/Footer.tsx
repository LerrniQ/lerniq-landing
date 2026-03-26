import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'
import logoImg from '@/assets/lerniq-logo.png'

type LinkTuple = [string, string]

const PRODUCT_LINKS: LinkTuple[]  = [['#features','Features'],['#benefits','Benefits'],['#survey','Surveys'],['#','Roadmap']]
const COMPANY_LINKS: LinkTuple[]  = [['#about','About Us'],['#','Our Team'],['#contact','Contact'],['#','Careers']]
const RESOURCE_LINKS: LinkTuple[] = [['#','Blog'],['#','Help Center'],['#','Privacy Policy'],['#','Terms of Service']]

const SOCIAL_LINKS = [
  { Icon: Twitter,   href: '#', label: 'Twitter/X' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Mail,      href: '#', label: 'Email' },
]

interface LinkColumnProps { title: string; links: LinkTuple[] }

function LinkColumn({ title, links }: LinkColumnProps) {
  return (
    <div>
      <h4 className="text-brand-gold font-semibold mb-4">{title}</h4>
      <ul className="space-y-3 list-none">
        {links.map(([href, label]) => (
          <li key={label}>
            <a
              href={href}
              className="text-white/75 no-underline transition-colors duration-300 hover:text-brand-gold"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="px-[5%] pt-16 pb-8 bg-brand-dark-blue border-t border-white/[0.16]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-clash text-3xl font-bold mb-4">
              <img src={logoImg} alt="LerniQ Logo" className="w-10 h-10 rounded-lg object-contain" />
              LerniQ
            </div>
            <p className="text-white/75 mb-6 leading-[1.7]">
              Reimagining campus learning for Nigerian tertiary institutions. Making academic
              coordination seamless, accessible, and efficient.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-white/[0.16] rounded-full flex items-center justify-center text-white no-underline transition-all duration-300 hover:bg-brand-blue hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Product"   links={PRODUCT_LINKS}  />
          <LinkColumn title="Company"   links={COMPANY_LINKS}  />
          <LinkColumn title="Resources" links={RESOURCE_LINKS} />
        </div>

        <div className="pt-8 border-t border-white/[0.16] text-center text-white/65 text-sm">
          © 2025 LerniQ. All rights reserved. Built with 💙 for Nigerian campuses.
        </div>
      </div>
    </footer>
  )
}
