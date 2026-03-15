import { useState } from 'react'
import { Send } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const initialForm = { name: '', email: '', phone: '', reason: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const ref = useScrollReveal()

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contact" ref={ref} className="scroll-reveal" style={styles.section}>
      <div style={styles.container}>
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2>Join the <span className="gradient-text">Movement</span></h2>
          <p className="section-description">
            Want to invest, volunteer, or be part of something transformative? Let's connect and
            build the future of campus learning together.
          </p>
        </div>

        {submitted && (
          <div style={styles.successBanner}>
            Thank you for your interest! We will get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input name="name" type="text" required value={form.name} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Email Address</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Phone Number (Optional)</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>I'm interested in…</label>
            <select name="reason" required value={form.reason} onChange={handleChange} style={styles.input}>
              <option value="">Select an option</option>
              <option value="invest">I want to invest</option>
              <option value="volunteer">I want to volunteer</option>
              <option value="student">I'm a student and want to contribute</option>
              <option value="lecturer">I'm a lecturer and want to be part of this</option>
              <option value="partnership">Partnership opportunities</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Message</label>
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} style={{ ...styles.input, resize: 'vertical', minHeight: 120 }} />
          </div>
          <button type="submit" style={styles.submitBtn} className="submit-btn-hover">
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
      <style>{`
        .submit-btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(46,63,226,0.4);
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #2e3fe2 !important;
          background: rgba(255,255,255,0.08) !important;
        }
        select option { background: #0a0b0f; color: #fff; }
      `}</style>
    </section>
  )
}

const styles = {
  section: { padding: '6rem 5%', background: 'rgba(26,31,77,0.3)' },
  container: { maxWidth: 800, margin: '0 auto' },
  successBanner: {
    background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.4)',
    borderRadius: 12,
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    color: '#4ade80',
    textAlign: 'center',
    fontWeight: 500,
  },
  form: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: '3rem',
    marginTop: '3rem',
  },
  group: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#ffc600' },
  input: {
    width: '100%',
    padding: '1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 12,
    color: '#ffffff',
    fontFamily: '"General Sans", sans-serif',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    width: '100%',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, #2e3fe2 0%, #ffc600 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: '"General Sans", sans-serif',
  },
}
