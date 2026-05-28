import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Heart, Building2, Users, Briefcase, Star, Shield, Stethoscope, Baby } from 'lucide-react'

interface PlanItem {
  icon: React.ReactNode
  label: string
  color: string
  bg: string
}

const PLANS: PlanItem[] = [
  { icon: <Heart size={16} aria-hidden="true" />,         label: 'Plano Individual',    color: '#e11d48', bg: '#fff1f2' },
  { icon: <Users size={16} aria-hidden="true" />,         label: 'Plano Familiar',      color: '#7c3aed', bg: '#f5f3ff' },
  { icon: <Building2 size={16} aria-hidden="true" />,     label: 'Plano Empresarial',   color: '#0056A7', bg: '#e8f1fb' },
  { icon: <Briefcase size={16} aria-hidden="true" />,     label: 'Plano MEI',           color: '#0284c7', bg: '#e0f2fe' },
  { icon: <Stethoscope size={16} aria-hidden="true" />,   label: 'Plano Odontológico',  color: '#059669', bg: '#ecfdf5' },
  { icon: <Baby size={16} aria-hidden="true" />,          label: 'Maternidade',         color: '#d97706', bg: '#fffbeb' },
  { icon: <Shield size={16} aria-hidden="true" />,        label: 'Seguro de Vida',      color: '#1863DC', bg: '#eff6ff' },
  { icon: <Star size={16} aria-hidden="true" />,          label: 'Plano Premium',       color: '#b45309', bg: '#fef3c7' },
]

const ITEMS = [...PLANS, ...PLANS, ...PLANS]

export default function InfiniteMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const id = requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 3
      tweenRef.current = gsap.to(track, {
        x: -oneSetWidth,
        duration: 30,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: string) =>
            parseFloat(x) % oneSetWidth * -1 >= oneSetWidth ? 0 : parseFloat(x)
          ),
        },
      })
      const wrapper = track.closest('.marquee-wrapper') as HTMLElement | null
      if (wrapper) {
        const pause = () => tweenRef.current?.pause()
        const resume = () => tweenRef.current?.resume()
        wrapper.addEventListener('mouseenter', pause)
        wrapper.addEventListener('mouseleave', resume)
        wrapper.addEventListener('focusin',   pause)
        wrapper.addEventListener('focusout',  resume)
      }
    })

    return () => { cancelAnimationFrame(id); tweenRef.current?.kill() }
  }, [])

  return (
    <section className="strip-section" aria-label="Tipos de planos disponíveis">
      <p className="strip-label">
        Planos disponíveis para você
      </p>
      <div className="marquee-wrapper" role="marquee" aria-live="off">
        <div className="marquee-track" ref={trackRef} aria-hidden="true">
          {ITEMS.map((item, i) => (
            <div className="marquee-item" key={i}>
              <div className="plan-chip" style={{ borderColor: `${item.color}25` }}>
                <div className="plan-chip-icon" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ul aria-label="Lista de planos" className="sr-only">
        {PLANS.map(p => <li key={p.label}>{p.label}</li>)}
      </ul>
    </section>
  )
}
