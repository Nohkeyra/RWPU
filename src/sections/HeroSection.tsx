import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ParticleCanvas from '@/components/ParticleCanvas';
import { ChevronDown, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollStarted, setScrollStarted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo('.hero-label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-tagline', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-floating', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.2');
    }, contentRef);

    const onScroll = () => setScrollStarted(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-deep-forest paper-texture">
      <ParticleCanvas />

      {/* Animated organic blobs — moss + carrot + sunshine tints */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-moss/10 organic-blob blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-crisp-carrot/5 organic-blob blur-3xl pointer-events-none" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-sunshine/5 organic-blob blur-3xl pointer-events-none" style={{ animationDelay: '-4s' }} />

      {/* Gradient overlays — keep the dark base for text legibility. */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/50 via-transparent to-deep-forest pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-forest/30 via-transparent to-deep-forest/30 pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
        <div className="max-w-[800px]">
          {/* Floating leaf decoration */}
          <div className="hero-floating absolute -top-8 -right-8 md:top-0 md:right-0 animate-float">
            <Leaf className="w-16 h-16 text-moss/20 animate-leaf-sway" strokeWidth={1} />
          </div>

          {/* Label — "Est. 1986" pill with kiwi pulsing dot */}
          <div className="hero-label inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-moss/10 border border-moss/20 backdrop-blur-sm">
            <span className="relative inline-flex">
              <span className="w-2 h-2 rounded-full bg-kiwi animate-kiwi-pulse" />
            </span>
            <span className="font-accent font-medium text-xs uppercase tracking-[0.2em] text-moss">
              Est. 1986 • Putrajaya
            </span>
          </div>

          {/* Title with brand gradient (moss → sunshine → carrot). */}
          <h1 className="hero-title font-display font-bold text-cream leading-[0.95] tracking-[-0.02em] text-[48px] md:text-[88px] lg:text-[104px]">
            Restoran
            <br />
            <span className="bg-gradient-to-r from-moss via-sunshine to-crisp-carrot bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Wawasan
            </span>
          </h1>

          {/* Tagline */}
          <p className="hero-tagline font-body font-light text-cream/50 text-lg md:text-xl leading-relaxed max-w-[500px] mx-auto mt-8">
            {t('hero_tagline')}
          </p>

          {/* CTAs — primary sunshine, secondary ghost */}
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/order"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-sunshine text-deep-forest rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5 relative overflow-hidden animate-sunshine-pulse"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {t('order_now')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <a
              href="#menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-cream/20 text-cream rounded-xl font-medium text-sm hover:bg-cream/5 hover:border-kiwi/40 hover:text-kiwi transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('view_our_menu')}
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
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
