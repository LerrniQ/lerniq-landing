import { Smartphone } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Demo() {
  const ref = useScrollReveal()

  return (
    <section ref={ref} className="scroll-reveal" style={styles.section}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Sneak Peek</span>
          <h2>A Glimpse Into <span className="gradient-text">LerniQ</span></h2>
          <p className="section-description">See what the platform will look like</p>
        </div>
        <div style={styles.preview}>
          <div style={styles.placeholder}>
            <Smartphone size={40} color="rgba(255,255,255,0.4)" style={{ marginBottom: '1rem' }} />
            <span>Platform Demo Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 5%' },
  preview: {
    maxWidth: 1000,
    margin: '3rem auto 0',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: '2rem',
    textAlign: 'center',
  },
  placeholder: {
    aspectRatio: '16/9',
    background: 'rgba(46,63,226,0.1)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.5)',
    border: '2px dashed rgba(255,255,255,0.2)',
  },
}
