import { lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import InfinitMarquee from './components/InfiniteMarquee'
import Benefits from './components/Benefits'
import FAQ from './components/FAQ'
import WhatsAppFloat from './components/WhatsAppFloat'

// Code-split below-fold components para melhor LCP
const PlanosSection    = lazy(() => import('./components/PlanosSection'))
const OperadorasMarquee = lazy(() => import('./components/OperadorasMarquee'))
const CTASection       = lazy(() => import('./components/CTASection'))
const Footer           = lazy(() => import('./components/Footer'))

const WA_NUMBER = '5511958632747'
const WA_MSG    = encodeURIComponent('Olá! Vim pelo site e gostaria de cotar um plano de saúde.')

export default function App() {
  return (
    <>
      <Nav />

      <main id="main-content">
        {/* ABOVE THE FOLD — critical render path */}
        <Hero whatsappNumber={WA_NUMBER} whatsappMsg={WA_MSG} />

        {/* Marquee de tipos de plano (chips) */}
        <InfinitMarquee />

        {/* BELOW THE FOLD */}
        <Benefits />

        <Suspense fallback={null}>
          {/* Seção de serviços (centrada, sem imagem) */}
          <PlanosSection />

          {/* ✦ Operadoras: planos.webp em loop infinito */}
          <OperadorasMarquee />

          <FAQ />
          <CTASection whatsappNumber={WA_NUMBER} whatsappMsg={WA_MSG} />
          <Footer />
        </Suspense>
      </main>

      <WhatsAppFloat phone={WA_NUMBER} message={WA_MSG} />
      <Analytics />
    </>
  )
}
