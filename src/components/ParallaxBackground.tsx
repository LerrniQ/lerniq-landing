import { useEffect, useRef } from 'react'
import {
  BookOpen, GraduationCap, Calendar, Bell, FileText,
  Users2, Laptop, Award, BookMarked, MessageSquare,
  ClipboardList, PenLine, Lightbulb, Wifi,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

interface LayerItem {
  Icon: LucideIcon
  size: number
  top: string
  left: string
  color: string
  opacity: number
  rotate: number
  dur: number
  delay: string
}

interface Layer {
  rate: number
  blur: string
  items: LayerItem[]
}

const LAYERS: Layer[] = [
  {
    rate: 0.025,
    blur: '1.5px',
    items: [
      { Icon: GraduationCap, size: 140, top: '12vh', left: '6%',  color: '#2e3fe2', opacity: 0.055, rotate: -18, dur: 22, delay: '0s'  },
      { Icon: BookOpen,      size: 118, top: '52vh', left: '76%', color: '#ffc600', opacity: 0.05,  rotate:  22, dur: 26, delay: '4s'  },
      { Icon: Laptop,        size: 106, top: '28vh', left: '47%', color: '#2e3fe2', opacity: 0.045, rotate:   8, dur: 20, delay: '8s'  },
      { Icon: Users2,        size: 124, top: '76vh', left: '18%', color: '#ffc600', opacity: 0.04,  rotate: -10, dur: 24, delay: '12s' },
    ],
  },
  {
    rate: 0.08,
    blur: '0px',
    items: [
      { Icon: Calendar,      size: 72,  top: '20vh', left: '86%', color: '#ffc600', opacity: 0.085, rotate:  14, dur: 18, delay: '1s'   },
      { Icon: Bell,          size: 66,  top: '65vh', left: '3%',  color: '#2e3fe2', opacity: 0.085, rotate:  -9, dur: 16, delay: '5s'   },
      { Icon: Award,         size: 78,  top: '40vh', left: '23%', color: '#ffc600', opacity: 0.075, rotate:  20, dur: 21, delay: '2.5s' },
      { Icon: MessageSquare, size: 70,  top: '8vh',  left: '58%', color: '#ffc600', opacity: 0.075, rotate:  26, dur: 19, delay: '7s'   },
      { Icon: Lightbulb,     size: 74,  top: '88vh', left: '70%', color: '#2e3fe2', opacity: 0.07,  rotate:  -6, dur: 23, delay: '9s'   },
      { Icon: Wifi,          size: 68,  top: '50vh', left: '62%', color: '#ffc600', opacity: 0.065, rotate:  12, dur: 17, delay: '11s'  },
    ],
  },
  {
    rate: 0.16,
    blur: '0px',
    items: [
      { Icon: FileText,      size: 46,  top: '32vh', left: '34%', color: '#ffc600', opacity: 0.1,   rotate:  24, dur: 14, delay: '1.5s' },
      { Icon: BookMarked,    size: 42,  top: '70vh', left: '82%', color: '#2e3fe2', opacity: 0.1,   rotate: -20, dur: 15, delay: '4.5s' },
      { Icon: PenLine,       size: 40,  top: '57vh', left: '41%', color: '#ffc600', opacity: 0.1,   rotate:  30, dur: 13, delay: '2.5s' },
      { Icon: ClipboardList, size: 44,  top: '22vh', left: '92%', color: '#2e3fe2', opacity: 0.1,   rotate: -25, dur: 16, delay: '6.5s' },
      { Icon: GraduationCap, size: 38,  top: '83vh', left: '27%', color: '#2e3fe2', opacity: 0.095, rotate:  16, dur: 12, delay: '3.5s' },
      { Icon: Bell,          size: 36,  top: '44vh', left: '11%', color: '#ffc600', opacity: 0.095, rotate: -30, dur: 15, delay: '8.5s' },
    ],
  },
]

export default function ParallaxBackground() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const rates = LAYERS.map((l) => l.rate)
    let rafId: number

    const tick = () => {
      const y = window.scrollY
      layerRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${-y * rates[i]}px)`
      })
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Ambient gradient orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full bg-gradient-blue opacity-[0.14]"
        style={{ filter: 'blur(130px)', top: -250, right: -250, animation: 'float 22s ease-in-out infinite' }}
      />
      <div
        className="absolute w-[580px] h-[580px] rounded-full bg-gradient-gold opacity-[0.08]"
        style={{ filter: 'blur(110px)', bottom: -180, left: -180, animation: 'float 18s ease-in-out infinite reverse' }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-brand opacity-[0.06]"
        style={{ filter: 'blur(140px)', top: '40%', left: '40%', transform: 'translate(-50%,-50%)', animation: 'float 28s ease-in-out infinite' }}
      />

      {/* Parallax icon layers */}
      {LAYERS.map((layer, li) => (
        <div
          key={li}
          ref={(el) => { layerRefs.current[li] = el }}
          className="absolute inset-0 will-change-transform"
          style={{ filter: layer.blur !== '0px' ? `blur(${layer.blur})` : undefined }}
        >
          {layer.items.map(({ Icon, size, top, left, color, opacity, rotate, dur, delay }, ii) => (
            <div
              key={ii}
              className="absolute leading-none"
              style={{
                top,
                left,
                opacity,
                color,
                '--r': `${rotate}deg`,
                animation: `bgIconFloat ${dur}s ease-in-out ${delay} infinite`,
              } as React.CSSProperties}
            >
              <Icon size={size} strokeWidth={1} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
