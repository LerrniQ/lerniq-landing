import { useState } from 'react'
import { Clock, Smartphone, TrendingUp, Target, MessageCircle, Bot, Zap, BarChart3, RefreshCw } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const tabs = {
  students: {
    label: 'For Students',
    cards: [
      { Icon: Clock, title: 'Never Miss Lectures', desc: 'Automated reminders and real-time schedule updates keep you informed' },
      { Icon: Smartphone, title: 'Everything in One Place', desc: 'All materials, schedules, and announcements accessible from your phone' },
      { Icon: TrendingUp, title: 'Better Planning', desc: 'View your entire semester at a glance and plan accordingly' },
    ],
  },
  reps: {
    label: 'For Course Reps',
    cards: [
      { Icon: Target, title: 'Streamlined Organization', desc: 'Manage class information efficiently with intuitive tools' },
      { Icon: MessageCircle, title: 'Easy Communication', desc: 'Reach your entire class instantly with one announcement' },
      { Icon: Bot, title: 'Automation', desc: 'Let the system handle notifications while you focus on coordination' },
    ],
  },
  lecturers: {
    label: 'For Lecturers',
    cards: [
      { Icon: Zap, title: 'Save Time', desc: 'Upload materials once and reach all students automatically' },
      { Icon: BarChart3, title: 'Better Engagement', desc: 'Track material access and student participation easily' },
      { Icon: RefreshCw, title: 'Less Repetition', desc: 'Centralized information means fewer repeated questions' },
    ],
  },
}

export default function Benefits() {
  const [active, setActive] = useState('students')
  const ref = useScrollReveal()

  return (
    <section id="benefits" ref={ref} className="scroll-reveal" style={styles.section}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">What You Gain</span>
          <h2>Benefits for <span className="gradient-text">Everyone</span></h2>
        </div>

        <div style={styles.tabBar}>
          {Object.entries(tabs).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                ...styles.tabBtn,
                ...(active === key ? styles.tabBtnActive : {}),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={styles.cardsGrid}>
          {tabs[active].cards.map(({ Icon, title, desc }) => (
            <div key={title} style={styles.card} className="benefit-card-hover">
              <div style={styles.iconBox}>
                <Icon size={32} color="#ffc600" strokeWidth={1.5} />
              </div>
              <h4 style={styles.cardTitle}>{title}</h4>
              <p style={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .benefit-card-hover {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease;
        }
        .benefit-card-hover:hover {
          transform: scale(1.05);
          border-color: #ffc600;
          box-shadow: 0 15px 50px rgba(255,198,0,0.2);
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 5%' },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '1rem 2rem',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 50,
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '"General Sans", sans-serif',
    fontSize: '1rem',
  },
  tabBtnActive: {
    background: 'linear-gradient(135deg, #2e3fe2 0%, #ffc600 100%)',
    borderColor: 'transparent',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  iconBox: { marginBottom: '1rem' },
  cardTitle: { fontSize: '1.5rem', marginBottom: '1rem' },
  cardDesc: { color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 },
}
