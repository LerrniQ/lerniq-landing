import { XCircle, CheckCircle2, Rocket } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const cards = [
  {
    Icon: XCircle,
    iconColor: '#ef4444',
    title: 'The Problem',
    text: 'Students miss lectures due to poor communication. Learning materials are scattered across multiple platforms. Course scheduling is manual and uncoordinated. The relationship between students, reps, and lecturers is often disconnected.',
  },
  {
    Icon: CheckCircle2,
    iconColor: '#22c55e',
    title: 'The Solution',
    text: 'LerniQ centralizes everything academic. One platform for schedules, materials, announcements, and communication. Course reps can easily update information, lecturers can share resources, and students stay informed automatically.',
  },
  {
    Icon: Rocket,
    iconColor: '#ffc600',
    title: 'The Vision',
    text: 'To strengthen the academic experience on Nigerian campuses by building digital tools that make communication, learning, and coordination seamless for everyone involved in the educational journey.',
  },
]

export default function About() {
  const ref = useScrollReveal()

  return (
    <section id="about" ref={ref} className="scroll-reveal" style={styles.section}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">About LerniQ</span>
          <h2>What is <span className="gradient-text">LerniQ</span>?</h2>
          <p className="section-description">
            A digital academic support system that helps students, course reps, and lecturers manage
            lectures, learning resources, schedules, and communication more effectively in Nigerian
            tertiary institutions.
          </p>
        </div>
        <div style={styles.grid}>
          {cards.map(({ Icon, iconColor, title, text }) => (
            <div key={title} style={styles.card} className="about-card-hover">
              <div style={{ ...styles.iconBox, background: `${iconColor}20`, border: `1px solid ${iconColor}40` }}>
                <Icon size={28} color={iconColor} />
              </div>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.cardText}>{text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .about-card-hover {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.4s ease;
        }
        .about-card-hover:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,0.05);
          border-color: #2e3fe2;
          box-shadow: 0 20px 60px rgba(46,63,226,0.2);
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: {
    padding: '6rem 5%',
    background: 'rgba(26,31,77,0.3)',
    position: 'relative',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  cardText: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.8,
  },
}
