import React, { useRef, useState, useTransition, useId } from 'react'
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react'
import HighlightWord from './HighlightWord'

interface HeroProps {
  whatsappNumber: string
  whatsappMsg: string
}

type PlanType = '' | 'individual' | 'familiar' | 'empresarial' | 'mei'

interface FormData {
  name: string
  phone: string
  email: string
  plan: PlanType
}
interface FormErrors {
  name?: string
  phone?: string
  email?: string
  plan?: string
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (!d.length) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

function validate(f: FormData): FormErrors {
  const e: FormErrors = {}
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Informe seu nome completo'
  if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone inválido (DDD + número)'
  if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'E-mail inválido'
  if (!f.plan) e.plan = 'Selecione o tipo de plano'
  return e
}

const TRUST_ITEMS = [
  { text: 'Regulado pela ANS', icon: '✓' },
  { text: '+4 milhões de famílias', icon: '★' },
  { text: 'Resposta em 15 min', icon: '⚡' },
]

export default function Hero({ whatsappNumber, whatsappMsg }: HeroProps) {
  const fid = useId()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<FormData>({ name: '', phone: '', email: '', plan: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const newVal = name === 'phone' ? formatPhone(value) : value
    setForm(f => ({ ...f, [name]: newVal }))
    if (errors[name as keyof FormErrors]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      const first = Object.keys(errs)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    startTransition(() => setSubmitted(true))
    const msg = encodeURIComponent(
      `Olá! Vim pelo site e quero cotar um plano de saúde.\nNome: ${form.name}\nTel: ${form.phone}\nEmail: ${form.email}\nTipo: ${form.plan}`
    )
    setTimeout(() => window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank', 'noopener,noreferrer'), 900)
  }

  return (
    <section className="hero" aria-labelledby="hero-heading" id="hero">
      {/* Decorações */}
      <div className="hero-deco hero-deco-1" aria-hidden="true" />
      <div className="hero-deco hero-deco-2" aria-hidden="true" />

      <div className="container hero-content">
        <div className="hero-two-col">

          {/* ── COPY ── */}
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Atendimento especializado em planos de saúde
            </div>

            <h1 className="hero-headline" id="hero-heading">
              Seu plano de saúde ideal,{' '}
              <HighlightWord color="#7dd3fc" delay={0.5}>
                sem complicação
              </HighlightWord>{' '}
              e sem pagar caro
            </h1>

            <p className="hero-sub">
              Somos especialistas em planos de saúde individuais, familiares e empresariais.
              Comparamos as melhores operadoras e entregamos a cotação certa para você em minutos.
            </p>

            <div className="hero-btn-group">
              <a
                href="#planos"
                className="btn btn-primary btn-primary-lg btn-pulse"
                aria-label="Escolha seu plano de saúde"
              >
                Escolha seu plano
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
                aria-label="Falar com especialista no WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            </div>

            <div className="hero-trust-strip">
              {TRUST_ITEMS.map(({ text, icon }) => (
                <div key={text} className="hero-trust-item">
                  <div className="hero-trust-icon" aria-hidden="true">
                    <span style={{ fontSize: '.75rem', fontWeight: 700 }}>{icon}</span>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── LEAD FORM ── */}
          <div id="form-lead">
            {submitted ? (
              <div className="lead-card">
                <div className="lead-success" role="status" aria-live="polite">
                  <div className="lead-success-icon" aria-hidden="true">
                    <CheckCircle2 size={32} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '.75rem' }}>
                    Solicitação recebida! 🎉
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '1rem', lineHeight: 1.7 }}>
                    Um especialista entrará em contato via WhatsApp em até <strong style={{ color: 'var(--brand-primary)' }}>15 minutos</strong>.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa btn-full"
                    aria-label="Chamar especialista no WhatsApp agora"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Chamar agora no WhatsApp
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="lead-card">
                <div className="lead-card-header">
                  <p className="lead-card-title">Receba sua cotação gratuita</p>
                  <p className="lead-card-sub">Preencha o formulário — leva menos de 60 segundos</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Formulário de cotação">
                  <div className="lead-form-grid">

                    <div className="form-group">
                      <label className="form-label" htmlFor={`${fid}-name`}>
                        Nome completo
                      </label>
                      <input
                        id={`${fid}-name`} name="name" type="text"
                        className={`form-input${errors.name ? ' has-error' : ''}`}
                        placeholder="Seu nome completo"
                        value={form.name} onChange={handleChange}
                        autoComplete="name" aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `${fid}-name-e` : undefined}
                      />
                      {errors.name && <span id={`${fid}-name-e`} className="form-error" role="alert">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`${fid}-phone`}>
                        WhatsApp / Telefone
                      </label>
                      <input
                        id={`${fid}-phone`} name="phone" type="tel" inputMode="numeric"
                        className={`form-input${errors.phone ? ' has-error' : ''}`}
                        placeholder="(11) 99999-9999"
                        value={form.phone} onChange={handleChange}
                        autoComplete="tel" aria-required="true"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? `${fid}-phone-e` : undefined}
                      />
                      {errors.phone && <span id={`${fid}-phone-e`} className="form-error" role="alert">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`${fid}-email`}>
                        E-mail
                      </label>
                      <input
                        id={`${fid}-email`} name="email" type="email"
                        className={`form-input${errors.email ? ' has-error' : ''}`}
                        placeholder="seuemail@exemplo.com"
                        value={form.email} onChange={handleChange}
                        autoComplete="email" aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? `${fid}-email-e` : undefined}
                      />
                      {errors.email && <span id={`${fid}-email-e`} className="form-error" role="alert">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`${fid}-plan`}>
                        Tipo de plano
                      </label>
                      <select
                        id={`${fid}-plan`} name="plan"
                        className={`form-select${errors.plan ? ' has-error' : ''}`}
                        value={form.plan} onChange={handleChange}
                        aria-required="true" aria-invalid={!!errors.plan}
                        aria-describedby={errors.plan ? `${fid}-plan-e` : undefined}
                      >
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="individual">Individual / Familiar</option>
                        <option value="familiar">Família (acima de 3 pessoas)</option>
                        <option value="empresarial">Empresarial (PME)</option>
                        <option value="mei">MEI / Autônomo</option>
                      </select>
                      {errors.plan && <span id={`${fid}-plan-e`} className="form-error" role="alert">{errors.plan}</span>}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-primary-lg btn-full btn-pulse"
                      disabled={isPending}
                      aria-label="Enviar cotação e receber proposta pelo WhatsApp"
                      style={{ marginTop: '.25rem' }}
                    >
                      {isPending ? 'Enviando…' : 'Quero minha cotação grátis'}
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>

                  </div>
                </form>

                <div className="form-security" aria-label="Segurança de dados">
                  <Lock size={12} aria-hidden="true" />
                  Seus dados estão seguros. Não fazemos spam.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
