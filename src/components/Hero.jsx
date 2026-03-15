import { BookOpen, Calendar, Bell, Users, ArrowRight, GraduationCap } from 'lucide-react'

const featureCards = [
  { Icon: BookOpen, title: 'Access Materials', desc: 'All your lecture notes in one place' },
  { Icon: Calendar, title: 'Track Schedules', desc: 'Never miss an important class' },
  { Icon: Bell, title: 'Get Notified', desc: 'Real-time updates from course reps' },
  { Icon: Users, title: 'Stay Connected', desc: 'Seamless lecturer-student communication' },
]

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="hero" style={styles.hero}>
      <div style={styles.container}>
        <div className="hero-content" style={styles.content}>
          <span style={styles.heroTag}>
            <GraduationCap size={16} style={{ display: 'inline', marginRight: 6 }} />
            Built for Nigerian Campuses
          </span>
          <h1>
            Smarter Learning for<br />
            <span className="gradient-text">Smarter Campuses</span>
          </h1>
          <p style={styles.description}>
            A digital platform helping students, lecturers, and course reps coordinate
            academic life effortlessly. Never miss a lecture, always have your materials,
            and stay connected.
          </p>
          <div style={styles.buttons}>
            <button className="btn-primary" onClick={() => scrollTo('survey')}>
              Take the Survey <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('about')}>
              Learn More
            </button>
          </div>
        </div>

        <div style={styles.visual}>
          <div style={styles.featureGrid}>
            {featureCards.map(({ Icon, title, desc }, i) => (
              <div key={title} style={{ ...styles.card, animationDelay: `${0.8 + i * 0.2}s` }} className="feature-card-anim">
                <div style={styles.iconBox}>
                  <Icon size={24} color="#fff" />
                </div>
                <h3 style={styles.cardTitle}>{title}</h3>
                <p style={styles.cardDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .feature-card-anim {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease both;
        }
        .feature-card-anim:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.08);
          border-color: #2e3fe2;
        }
        @media (max-width: 968px) {
          .hero-two-col { grid-template-columns: 1fr !important; text-align: center; }
          .hero-buttons-wrap { justify-content: center !important; }
          .hero-feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '8rem 5% 4rem',
    position: 'relative',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    animation: 'fadeInUp 1s ease',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'rgba(255,198,0,0.1)',
    border: '1px solid #ffc600',
    borderRadius: 50,
    color: '#ffc600',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    animation: 'fadeInUp 1s ease 0.2s both',
  },
  description: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '2.5rem',
    lineHeight: 1.8,
    animation: 'fadeInUp 1s ease 0.6s both',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    animation: 'fadeInUp 1s ease 0.8s both',
  },
  visual: {
    animation: 'fadeInUp 1s ease 0.6s both',
  },
  featureGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  iconBox: {
    width: 50,
    height: 50,
    background: 'linear-gradient(135deg, #2e3fe2 0%, #5b6ef7 100%)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
  },
}
