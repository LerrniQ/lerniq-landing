import { Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Demo() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal py-24 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">Sneak Peek</Badge>
          <h2>A Glimpse Into <span className="gradient-text">LerniQ</span></h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">See what the platform will look like</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="aspect-video bg-brand-blue/10 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/20">
            <Smartphone size={48} className="text-white/40" />
            <span className="text-white/50 text-lg">Platform Demo Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  )
}
