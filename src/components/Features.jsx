import { Megaphone, Library, CalendarDays, BellRing, MessageSquare, ShieldCheck } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const features = [
  { Icon: Megaphone, title: 'Announcements Board', desc: 'Real-time updates from course reps and lecturers delivered straight to your dashboard' },
  { Icon: Library, title: 'Materials Library', desc: 'Upload, download, and organize all course materials in one centralized location' },
  { Icon: CalendarDays, title: 'Smart Calendar', desc: 'Automated scheduling system that keeps everyone on the same page' },
  { Icon: BellRing, title: 'Push Notifications', desc: 'Never miss important updates with instant mobile and web notifications' },
  { Icon: MessageSquare, title: 'Course Channels', desc: 'Dedicated spaces for each course with organized discussions and resources' },
  { Icon: ShieldCheck, title: 'Role-Based Access', desc: 'Customized permissions ensuring students, reps, and lecturers have the right tools' },
]

export default function Features() {
  const ref = useScrollReveal()

  return (
    <section id="features" ref={ref} className="scroll-reveal" style={styles.section}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Core Features</span>
          <h2>How <span className="gradient-text">LerniQ</span> Works</h2>
          <p className="section-description">Everything you need for a seamless academic experience</p>
        </div>
        <div style={styles.grid}>
          {features.map(({ Icon, title, desc }, i) => (
            <div key={title} style={styles.item} className="feature-item-hover">
              <div style={styles.numBox}>
                <span style={styles.num}>{i + 1}</span>
                <div style={styles.iconBox}>
                  <Icon size={20} color="#0a0b0f" />
                </div>
              </div>
              <h4 style={styles.title}>{title}</h4>
              <p style={styles.desc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .feature-item-hover {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        .feature-item-hover:hover {
          background: rgba(255,255,255,0.05);
          border-color: #2e3fe2;
          transform: translateY(-5px);
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 5%', background: 'rgba(26,31,77,0.3)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  numBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  num: {
    width: 32,
    height: 32,
    background: 'linear-gradient(135deg, #ffc600 0%, #ffd966 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#0a0b0f',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #ffc600 0%, #ffd966 100%)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: '1.3rem', marginBottom: '0.75rem' },
  desc: { color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 },
}
