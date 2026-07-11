import SectionLabel from '@/components/SectionLabel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

export default function StorySection() {
  const { t, language } = useLanguage();

  const STATS = [
    { number: '1986', label: t('established') },
    { number: '40+', label: t('years_service') },
    { number: '4.9', label: t('star_rating') },
  ];

  const sectionRef = useScrollTrigger<HTMLElement>({
    animation: 'fade-up',
    y: 40,
    childSelector: '.story-animate',
    stagger: 0.15,
  });

  const imageRef = useScrollTrigger<HTMLDivElement>({
    animation: 'slide-right',
    x: 40,
    duration: 1.0,
  });

  return (
    <section id="story" ref={sectionRef} className="section-padding bg-deep-forest">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="story-animate flex justify-center lg:justify-start">
              <SectionLabel text={t('our_story')} light />
            </div>

            <h2 className="story-animate font-display font-semibold text-[36px] md:text-[54px] text-cream leading-[1.04] mb-8 text-center lg:text-left">
              {t('story_title')}
            </h2>

            <div className="space-y-5 mb-10 text-center lg:text-left">
              <p className="story-animate font-body font-light text-lg text-cream/68 leading-relaxed">
                {t('story_p1')}
              </p>
              <p className="story-animate font-body font-light text-lg text-cream/64 leading-relaxed">
                {t('story_p2')}
              </p>
              <p className="story-animate font-body font-light text-lg text-cream/64 leading-relaxed">
                {t('story_p3')}
              </p>
            </div>

            <div className="story-animate flex justify-center lg:justify-start gap-10 mb-10 flex-wrap">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-[96px]">
                  <span className="font-display font-semibold text-4xl tracking-tight bg-gradient-to-br from-sunshine to-crisp-carrot bg-clip-text text-transparent">
                    {stat.number}
                  </span>
                  <span className="block font-accent font-medium text-[10px] uppercase tracking-[0.18em] text-stone mt-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="story-animate flex justify-center lg:justify-start">
              <Button asChild className="bg-sunshine text-deep-forest hover:bg-honey hover:shadow-sunshine-glow font-medium text-sm px-8 py-6 h-auto rounded-full transition-all duration-300 group">
                <a href="#menu">
                  {t('explore_menu')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>

          <div ref={imageRef} className="lg:col-span-5">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-sunshine/15 via-transparent to-kiwi/10 blur-xl" />
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] border border-white/8 shadow-[0_22px_50px_-24px_rgba(0,0,0,0.65)]">
                <img
                  src="/assets/story-interior.jpg"
                  alt="Restoran Wawasan interior"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/70 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-forest-green/95 backdrop-blur-xl rounded-2xl p-5 border border-sunshine/15 shadow-xl hidden sm:block max-w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sunshine/14 border border-sunshine/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-sunshine" strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="font-display font-medium text-cream text-sm">
                      {language === 'bm' ? 'Halal & mesra keluarga' : 'Halal & family-friendly'}
                    </p>
                    <p className="text-[10px] text-sunshine/80 uppercase tracking-wider font-accent">
                      {language === 'bm' ? 'Sarapan, makan tengah hari, katering' : 'Breakfast, lunch, catering'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
