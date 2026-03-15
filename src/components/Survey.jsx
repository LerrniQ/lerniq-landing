import { PopupButton } from '@typeform/embed-react'
import { GraduationCap, Users2, BookUser } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Replace these IDs with your real Typeform form IDs
const FORM_IDS = {
  student: 'STUDENT_FORM_ID',
  courseRep: 'COURSE_REP_FORM_ID',
  lecturer: 'LECTURER_FORM_ID',
}

const surveys = [
  {
    key: 'student',
    Icon: GraduationCap,
    label: "I'm a Student",
    sub: 'Share Your Experience',
  },
  {
    key: 'courseRep',
    Icon: Users2,
    label: "I'm a Course Rep",
    sub: 'Tell Us Your Challenges',
  },
  {
    key: 'lecturer',
    Icon: BookUser,
    label: "I'm a Lecturer",
    sub: 'Help Us Improve',
  },
]

export default function Survey() {
  const ref = useScrollReveal()

  return (
    <section id="survey" ref={ref} className="scroll-reveal" style={styles.section}>
      <div style={styles.container}>
        <h2 style={{ marginBottom: '1.5rem' }}>Shape the Future with Us</h2>
        <p style={styles.description}>
          Your feedback is crucial in building a platform that truly serves Nigerian campuses.
          Take a minute to share your experience and help us create something amazing.
        </p>
        <div style={styles.buttons}>
          {surveys.map(({ key, Icon, label, sub }) => (
            <PopupButton
              key={key}
              id={FORM_IDS[key]}
              style={styles.surveyBtn}
              className="survey-popup-btn"
            >
              <Icon size={32} strokeWidth={1.5} color="#2e3fe2" />
              <strong>{label}</strong>
              <small style={styles.small}>{sub}</small>
            </PopupButton>
          ))}
        </div>
      </div>
      <style>{`
        .survey-popup-btn {
          display: flex !important;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 2.5rem;
          background: rgba(255,255,255,0.95);
          color: #2e3fe2;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          min-width: 250px;
          transition: all 0.3s ease;
          font-family: "General Sans", sans-serif;
        }
        .survey-popup-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          background: #ffffff;
        }
        @media (max-width: 640px) {
          .survey-popup-btn { min-width: 100%; }
        }
      `}</style>
    </section>
  )
}

const styles = {
  section: {
    padding: '6rem 5%',
    background: 'linear-gradient(135deg, #2e3fe2 0%, #5b6ef7 100%)',
    position: 'relative',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    textAlign: 'center',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '3rem',
    opacity: 0.9,
    maxWidth: 700,
    margin: '0 auto 3rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  surveyBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 2.5rem',
    background: 'rgba(255,255,255,0.95)',
    color: '#2e3fe2',
    border: 'none',
    borderRadius: 16,
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    minWidth: 250,
    transition: 'all 0.3s ease',
  },
  small: {
    fontWeight: 400,
    fontSize: '0.85rem',
    color: '#6b7280',
  },
}
