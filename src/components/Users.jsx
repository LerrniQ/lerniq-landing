import { GraduationCap, Users2, BookUser, Check } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const users = [
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
  const ref = useScrollReveal()

  return (
    <section ref={ref} className="scroll-reveal" style={styles.section}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Built for You</span>
          <h2>Who is <span className="gradient-text">LerniQ</span> For?</h2>
          <p className="section-description">Designed specifically for the Nigerian campus community</p>
        </div>
        <div style={styles.grid}>
          {users.map(({ Icon, title, subtitle, items }) => (
            <div key={title} style={styles.card} className="user-card-hover">
              <div style={styles.iconWrap}>
                <Icon size={48} color="#ffc600" strokeWidth={1.5} />
              </div>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.subtitle}>{subtitle}</p>
              <ul style={styles.list}>
                {items.map((item) => (
                  <li key={item} style={styles.listItem}>
                    <Check size={16} color="#ffc600" style={{ flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .user-card-hover {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 30px;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .user-card-hover::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(135deg, #2e3fe2 0%, #ffc600 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .user-card-hover:hover::before { transform: scaleX(1); }
        .user-card-hover:hover {
          transform: translateY(-10px);
          border-color: #ffc600;
          box-shadow: 0 25px 70px rgba(255,198,0,0.15);
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 5%' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  iconWrap: { marginBottom: '1.5rem' },
  cardTitle: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#ffc600' },
  subtitle: { color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' },
  list: { listStyle: 'none', marginTop: '1.5rem' },
  listItem: {
    padding: '0.75rem 0',
    color: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
}
