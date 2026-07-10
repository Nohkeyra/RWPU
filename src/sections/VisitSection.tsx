import { MapPin, Clock, Phone, ArrowRight, Navigation } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

export default function VisitSection() {
  const { t } = useLanguage();

  const HOURS = [
    { day: t('mon_thu'), time: t('time_730_400') },
    { day: t('friday'), time: t('time_730_400'), note: t('rojak_note') },
    { day: t('saturday'), time: t('closed') },
    { day: t('sunday'), time: t('closed') },
  ];

  const contentRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    childSelector: '.visit-animate',
    stagger: 0.15,
  });

  const cardsRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 30,
    childSelector: '.info-card',
    stagger: 0.15,
    delay: 0.3,
  });

  const ctaRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 30,
    delay: 0.6,
  });

  return (
    <section id="visit" className="section-padding bg-deep-forest relative overflow-hidden paper-texture">
      {/* Organic background blobs — moss, carrot, kiwi */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-moss/5 organic-blob blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-crisp-carrot/5 organic-blob blur-3xl pointer-events-none" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-kiwi/5 organic-blob blur-3xl pointer-events-none" style={{ animationDelay: '-6s' }} />

      <div className="content-container relative">
        {/* Header */}
        <div ref={contentRef} className="mb-12">
          <div className="visit-animate">
            <SectionLabel text={t('visit_us')} light />
          </div>
          <h2 className="visit-animate font-display font-semibold text-[36px] md:text-[52px] text-cream leading-[1.05] mb-4">
            {t('come_dine')}
          </h2>
          <p className="visit-animate font-body text-lg text-cream/50 max-w-[500px]">
            {t('visit_subtitle')}
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left - Image & Quick Info */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-6 group">
              <img
                src="/assets/restoran-exterior.jpg"
                alt="Restoran Wawasan"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              
              {/* Floating Info with glass effect */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-deep-forest/80 backdrop-blur-xl rounded-2xl p-5 border border-cream/10 shadow-xl group-hover:border-moss/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-moss/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-moss" />
                    </div>
                    <div>
                      <p className="text-cream font-medium">Menara PjH, Putrajaya</p>
                      <p className="text-cream/50 text-sm">Level B3, Unit 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions with hover lift */}
            <div className="flex gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Restoran+Wawasan+Menara+PjH+Putrajaya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-moss text-cream rounded-xl font-medium text-sm hover:bg-fern hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(74,124,89,0.3)] transition-all"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </a>
              <a
                href="tel:+60178582642"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-forest-green text-cream rounded-xl font-medium text-sm hover:bg-light-forest hover:-translate-y-0.5 transition-all border border-cream/10"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>

          {/* Right - Detailed Cards */}
          <div ref={cardsRef} className="lg:col-span-7 flex flex-col gap-6">
            {/* Hours */}
            <div className="info-card bg-forest-green rounded-2xl p-6 md:p-8 border border-cream/5 hover:border-moss/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-moss/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-moss" />
                </div>
                <h3 className="font-display font-medium text-cream text-xl">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between items-center py-3 border-b border-cream/5 last:border-0 group">
                    <span className="text-cream/60 group-hover:text-cream transition-colors">{h.day}</span>
                    <div className="text-right">
                      <span className={`font-medium ${h.time === 'Closed' ? 'text-tomato-burst' : 'text-cream'}`}>
                        {h.time}
                      </span>
                      {h.note && <span className="block text-[10px] text-sunshine/80 font-accent">*{h.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="info-card bg-forest-green rounded-2xl p-6 md:p-8 border border-cream/5 hover:border-moss/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-moss/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-moss" />
                </div>
                <h3 className="font-display font-medium text-cream text-xl">Contact</h3>
              </div>
              <div className="space-y-4">
                <a href="tel:+60178582642" className="flex items-center gap-4 text-cream hover:text-moss transition-colors group">
                  <span className="text-sm text-cream/40 w-16 group-hover:text-moss transition-colors">Call</span>
                  <span className="font-medium">+6017-8582642</span>
                  <span className="text-xs text-cream/30">(Pak Usop)</span>
                </a>
                <a href="https://wa.me/60173157721" className="flex items-center gap-4 text-cream hover:text-moss transition-colors group">
                  <span className="text-sm text-cream/40 w-16 group-hover:text-moss transition-colors">WhatsApp</span>
                  <span className="font-medium">+6017-3157721</span>
                  <span className="text-xs text-cream/30">(Mad)</span>
                </a>
                <div className="flex items-center gap-4 text-cream/40">
                  <span className="text-sm w-16">Email</span>
                  <span>wawasan.orders@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA with organic shape */}
        <div
          ref={ctaRef}
          className="mt-16 relative rounded-3xl p-8 md:p-12 overflow-hidden group"
        >
          {/* Animated brand gradient background — moss → fern → sunshine → carrot */}
          <div className="absolute inset-0 bg-gradient-to-r from-moss via-fern via-sunshine to-crisp-carrot animate-gradient-shift bg-[length:200%_auto]" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v4h-4v-4h4zm4 4v4h-4v-4h4zM6 34v4H2v-4h4zm4 4v4H6v-4h4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-semibold text-2xl md:text-3xl text-cream">
                {t('cta_title')}
              </h3>
              <p className="text-cream/70 mt-2">
                {t('cta_subtitle')}
              </p>
            </div>
            <a
              href="tel:+60178582642"
              className="inline-flex items-center gap-2 px-8 py-4 bg-deep-forest text-cream rounded-xl font-medium hover:bg-forest-green hover:-translate-y-0.5 transition-all shadow-lg group-hover:shadow-xl"
            >
              {t('contact_pak_usop')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
