import { MapPin, Clock, Phone, ArrowRight, Navigation } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

export default function VisitSection() {
  const { t, language } = useLanguage();

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
    <section id="visit" className="section-padding bg-deep-forest relative overflow-hidden paper-texture kp-songkok">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sunshine/8 to-transparent pointer-events-none" />

      <div className="content-container relative">
        <div ref={contentRef} className="mb-12">
          <div className="visit-animate">
            <SectionLabel text={t('visit_us')} light />
          </div>
          <h2 className="visit-animate font-display font-semibold text-[36px] md:text-[52px] text-cream leading-[1.05] mb-4">
            {t('come_dine')}
          </h2>
          <p className="visit-animate font-body text-lg text-cream/58 max-w-[620px] leading-relaxed">
            {language === 'bm'
              ? 'Lokasi di Menara PjH menjadikan Restoran Wawasan Pak Usop pilihan mudah untuk sarapan, makan tengah hari, mesyuarat, dan singgah selepas urusan di Putrajaya.'
              : 'Located in Menara PjH, Restoran Wawasan Pak Usop is an easy stop for breakfast, lunch, meetings, and day-to-day dining in Putrajaya.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] mb-6 group border border-white/[0.08] shadow-[0_24px_55px_-24px_rgba(0,0,0,0.6)]">
              <img
                src="/assets/restoran-exterior.jpg"
                alt="Restoran Wawasan"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/15 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-deep-forest/78 backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08] shadow-xl group-hover:border-sunshine/25 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sunshine/12 flex items-center justify-center border border-sunshine/20">
                      <MapPin className="w-6 h-6 text-sunshine" />
                    </div>
                    <div>
                      <p className="text-cream font-medium">Menara PjH, Presint 2</p>
                      <p className="text-cream/50 text-sm">Unit 3, Level B3, Putrajaya</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Restoran+Wawasan+Pak+Usop+Putrajaya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-sunshine text-deep-forest rounded-full font-medium text-sm hover:bg-honey hover:-translate-y-0.5 hover:shadow-sunshine-glow transition-all"
              >
                <Navigation className="w-4 h-4" />
                {t('get_directions')}
              </a>
              <a
                href="tel:+60178582642"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-forest-green text-cream rounded-full font-medium text-sm hover:bg-light-forest hover:-translate-y-0.5 transition-all border border-white/[0.08]"
              >
                <Phone className="w-4 h-4 text-sunshine" />
                {t('call_now')}
              </a>
            </div>
          </div>

          <div ref={cardsRef} className="lg:col-span-7 flex flex-col gap-6">
            <div className="info-card bg-forest-green rounded-[28px] p-6 md:p-8 border border-white/[0.06] hover:border-sunshine/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunshine/16 to-crisp-carrot/10 border border-sunshine/25 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sunshine" />
                </div>
                <h3 className="font-display font-medium text-cream text-xl">{t('hours')}</h3>
              </div>
              <div className="space-y-3">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between items-center py-3 border-b border-white/[0.05] last:border-0 group gap-6">
                    <span className="text-cream/62 group-hover:text-cream transition-colors">{h.day}</span>
                    <div className="text-right">
                      <span className={`font-medium ${h.time === 'Closed' || h.time === 'Tutup' ? 'text-kiwi' : 'text-cream'}`}>
                        {h.time}
                      </span>
                      {h.note && <span className="block text-[10px] text-sunshine/80 font-accent uppercase tracking-[0.14em]">{h.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card bg-forest-green rounded-[28px] p-6 md:p-8 border border-white/[0.06] hover:border-sunshine/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunshine/16 to-crisp-carrot/10 border border-sunshine/25 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-sunshine" />
                </div>
                <h3 className="font-display font-medium text-cream text-xl">Contact</h3>
              </div>
              <div className="space-y-4 text-sm">
                <a href="tel:+60178582642" className="flex items-center gap-4 text-cream hover:text-sunshine transition-colors group">
                  <span className="text-cream/40 w-20 group-hover:text-sunshine transition-colors">Call</span>
                  <span className="font-medium">+60 17-858 2642</span>
                  <span className="text-xs text-cream/30">(Pak Usop)</span>
                </a>
                <a href="https://wa.me/60173157721" className="flex items-center gap-4 text-cream hover:text-sunshine transition-colors group">
                  <span className="text-cream/40 w-20 group-hover:text-sunshine transition-colors">WhatsApp</span>
                  <span className="font-medium">+60 17-315 7721</span>
                  <span className="text-xs text-cream/30">(Mad)</span>
                </a>
                <div className="flex items-center gap-4 text-cream/60">
                  <span className="w-20">Email</span>
                  <span>wawasan.orders@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={ctaRef} className="mt-16 relative rounded-[32px] p-8 md:p-12 overflow-hidden group border border-white/[0.08]">
          <div className="absolute inset-0 bg-brand-cta animate-gradient-shift bg-[length:200%_auto]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'72\' height=\'72\' viewBox=\'0 0 72 72\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'0.8\' stroke-opacity=\'0.45\'%3E%3Ccircle cx=\'36\' cy=\'36\' r=\'13\'/%3E%3Cpath d=\'M36 8v56M8 36h56M16 16l40 40M56 16L16 56\'/%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-semibold text-2xl md:text-3xl text-cream">
                {t('cta_title')}
              </h3>
              <p className="text-cream/75 mt-2 max-w-xl">
                {t('cta_subtitle')}
              </p>
            </div>
            <a
              href="tel:+60178582642"
              className="inline-flex items-center gap-2 px-8 py-4 bg-deep-forest text-cream rounded-full font-medium hover:bg-forest-green hover:-translate-y-0.5 transition-all shadow-lg group-hover:shadow-xl"
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
