import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'
import logoImg from '../assets/lerniq-logo.png'

const productLinks = [['#features', 'Features'], ['#benefits', 'Benefits'], ['#survey', 'Surveys'], ['#', 'Roadmap']]
const companyLinks = [['#about', 'About Us'], ['#', 'Our Team'], ['#contact', 'Contact'], ['#', 'Careers']]
const resourceLinks = [['#', 'Blog'], ['#', 'Help Center'], ['#', 'Privacy Policy'], ['#', 'Terms of Service']]

const socialLinks = [
  { Icon: Twitter, href: '#', label: 'Twitter/X' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <img src={logoImg} alt="LerniQ Logo" style={styles.logoImg} />
              LerniQ
            </div>
            <p style={styles.desc}>
              Reimagining campus learning for Nigerian tertiary institutions. Making academic
              coordination seamless, accessible, and efficient.
            </p>
            <div style={styles.socials}>
              {socialLinks.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={styles.socialLink} className="social-link-hover">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="Company" links={companyLinks} />
          <LinkColumn title="Resources" links={resourceLinks} />
        </div>

        <div style={styles.bottom}>
          <p>© 2025 LerniQ. All rights reserved. Built with 💙 for Nigerian campuses.</p>
        </div>
      </div>
      <style>{`
        .social-link-hover:hover {
          background: #2e3fe2 !important;
          transform: translateY(-3px);
        }
        .footer-link-hover:hover { color: #ffc600 !important; }
        @media (max-width: 968px) {
          .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
        }
      `}</style>
    </footer>
  )
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <h4 style={styles.colTitle}>{title}</h4>
      <ul style={{ listStyle: 'none' }}>
        {links.map(([href, label]) => (
          <li key={label} style={{ marginBottom: '0.75rem' }}>
            <a href={href} style={styles.link} className="footer-link-hover">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  footer: {
    padding: '4rem 5% 2rem',
    background: '#1a1f4d',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  container: { maxWidth: 1400, margin: '0 auto' },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  brand: { maxWidth: 350 },
  logo: {
    fontFamily: '"Clash Display", sans-serif',
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoImg: { width: 40, height: 40, borderRadius: 8 },
  desc: { color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', lineHeight: 1.7 },
  socials: { display: 'flex', gap: '1rem' },
  socialLink: {
    width: 40,
    height: 40,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#ffffff',
    transition: 'all 0.3s ease',
  },
  colTitle: { marginBottom: '1rem', color: '#ffc600' },
  link: { color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.3s ease' },
  bottom: {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
  },
}
