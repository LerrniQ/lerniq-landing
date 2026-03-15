import logoImg from '../assets/lerniq-logo.png'

export default function Navbar() {
  const handleNav = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <a href="#" style={styles.logo}>
          <img src={logoImg} alt="LerniQ Logo" style={styles.logoImg} />
          LerniQ
        </a>
        <ul style={styles.navLinks}>
          {[['about', 'About'], ['features', 'Features'], ['benefits', 'Benefits'], ['contact', 'Contact']].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} style={styles.navLink} onClick={(e) => handleNav(e, id)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#survey" style={styles.ctaBtn} onClick={(e) => handleNav(e, 'survey')}>
          Take Survey
        </a>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    padding: '1.5rem 5%',
    background: 'rgba(10, 11, 15, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    zIndex: 1000,
    animation: 'slideDown 0.8s ease',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: '"Clash Display", sans-serif',
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#ffffff',
    textDecoration: 'none',
  },
  logoImg: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  navLinks: {
    display: 'flex',
    gap: '2.5rem',
    listStyle: 'none',
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 500,
  },
  ctaBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2e3fe2 0%, #ffc600 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: 50,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
}
