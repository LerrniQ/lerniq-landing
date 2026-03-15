import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Users from '@/components/Users'
import Features from '@/components/Features'
import Benefits from '@/components/Benefits'
import Survey from '@/components/Survey'
import Demo from '@/components/Demo'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ParallaxBackground from '@/components/ParallaxBackground'

export default function App() {
  return (
    <>
      <ParallaxBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Users />
        <Features />
        <Benefits />
        <Survey />
        <Demo />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
