import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronDown, ArrowRight, Coffee, MapPin, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollStarted, setScrollStarted] = useState(false);

  const isBm = language === 'bm';
  const chips = [
    isBm ? 'Sejak 1986' : 'Since 1986',
    isBm ? 'Pemandangan tasik Putrajaya' : 'Putrajaya lake view',
    isBm ? 'Sarapan, makan tengah hari & katering' : 'Breakfast, lunch & catering',
  ];

  const highlights = [
    {
      icon: Coffee,
      title: isBm ? 'Sarapan legenda' : 'Legendary breakfast',
      subtitle: isBm ? 'Lontong, soto, teh tarik dan banyak lagi' : 'Lontong, soto, teh tarik and more',
    },
    {
      icon: UtensilsCrossed,
      title: isBm ? 'Mesyuarat & katering' : 'Meeting packs & catering',
      subtitle: isBm ? 'Sesuai untuk pejabat, agensi dan acara' : 'Built for offices, agencies and events',
    },
    {
      icon: MapPin,
      title: isBm ? 'Di tengah Putrajaya' : 'In the heart of Putrajaya',
      subtitle: isBm ? 'Menara PjH dengan suasana tasik' : 'Menara PjH with a scenic lakeside feel',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.hero-chip', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' })
        .fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.2')
        .fromTo('.hero-tagline', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.35')
        .fromTo('.hero-panel', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.15');
    }, contentRef);

    const onScroll = () => setScrollStarted(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-deep-forest kp-songkok">
      <img
        src="/assets/putrajaya-lake-view.jpg"
        alt="Putrajaya lake view"
        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,168,83,0.22),transparent_28%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-forest via-deep-forest/70 to-deep-forest/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-forest via-deep-forest/40 to-deep-forest/35" />
      <div className="absolute inset-0 kp-batik opacity-50 mix-blend-overlay" />

      <div ref={contentRef} className="relative content-container flex flex-col justify-center min-h-[100dvh] pt-28 pb-10 lg:pb-14">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-7">
            {chips.map((chip) => (
              <span
                key={chip}
                className="hero-chip inline-flex items-center gap-2 rounded-full border border-sunshine/20 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-sunshine backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sunshine" />
                {chip}
              </span>
            ))}
          </div>

          <h1 className="hero-title font-display font-bold text-cream leading-[0.92] tracking-[-0.03em] text-[48px] md:text-[86px] lg:text-[104px]">
            Restoran Wawasan
            <br />
            <span className="bg-gradient-to-r from-sunshine via-honey to-crisp-carrot bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              Pak Usop
            </span>
          </h1>

          <p className="hero-tagline font-body font-light text-cream/78 text-lg md:text-[22px] leading-relaxed max-w-[760px] mt-7">
            {t('hero_tagline')}
          </p>

          <p className="hero-tagline font-body text-cream/58 text-sm md:text-base leading-relaxed max-w-[680px] mt-4">
            {isBm
              ? 'Warisan rasa sejak Singapura 1986, kini di Putrajaya dengan hidangan sarapan, menu klasik Nusantara, pakej mesyuarat dan katering yang mesra pejabat.'
              : 'A long-standing culinary legacy from Singapore since 1986, now rooted in Putrajaya with beloved breakfast classics, Nusantara comfort dishes, meeting packs, and catering.'}
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              to="/order"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-sunshine text-deep-forest rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">{t('order_now')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <a
              href="#menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/15 text-cream rounded-full font-medium text-sm hover:bg-white/[0.06] hover:border-sunshine/35 hover:text-sunshine transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('view_our_menu')}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 max-w-5xl">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="hero-panel rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-5 md:p-6 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.45)]"
              >
                <div className="w-11 h-11 rounded-2xl bg-sunshine/12 border border-sunshine/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sunshine" />
                </div>
                <h3 className="font-display text-xl text-cream">{item.title}</h3>
                <p className="text-sm text-cream/58 mt-2 leading-relaxed">{item.subtitle}</p>
              </div>
            );
          })}
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${scrollStarted ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-accent">Scroll</span>
            <ChevronDown className="w-5 h-5 text-sunshine animate-bounce-down" />
          </div>
        </div>
      </div>
    </section>
  );
}
