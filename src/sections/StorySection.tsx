import SectionLabel from '@/components/SectionLabel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

export default function StorySection() {
  const { t } = useLanguage();

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
          {/* Text Column - 7 columns */}
          <div className="lg:col-span-7">
            <div className="story-animate flex justify-center lg:justify-start">
              <SectionLabel text={t('our_story')} light />
            </div>
            
            <h2 className="story-animate font-display font-semibold text-[36px] md:text-[52px] text-cream leading-[1.05] mb-8 text-center lg:text-left">
              {t('story_title')}
            </h2>
            
            <div className="space-y-5 mb-10 text-center lg:text-left">
              <p className="story-animate font-body font-light text-lg text-cream/60 leading-relaxed">
                {t('story_p1')}
              </p>
              <p className="story-animate font-body font-light text-lg text-cream/60 leading-relaxed">
                {t('story_p2')}
              </p>
              <p className="story-animate font-body font-light text-lg text-cream/60 leading-relaxed">
                {t('story_p3')}
              </p>
            </div>

            {/* Stats */}
            <div className="story-animate flex justify-center lg:justify-start gap-10 mb-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="relative pl-0 lg:first:pl-0">
                  <span className="font-display font-medium text-4xl text-moss tracking-tight">
                    {stat.number}
                  </span>
                  <span className="block font-['Montserrat',sans-serif] font-medium text-[10px] uppercase tracking-[0.15em] text-stone mt-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="story-animate flex justify-center lg:justify-start">
              <Button asChild className="bg-moss text-cream hover:bg-fern hover:shadow-[0_8px_24px_rgba(74,124,89,0.3)] font-medium text-sm px-8 py-6 h-auto rounded-xl transition-all duration-300 group">
                <a href="#menu">
                  {t('explore_menu')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image Column - 5 columns */}
          <div ref={imageRef} className="lg:col-span-5">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src={`/assets/story-interior.jpg`}
                  alt="Restoran Wawasan interior"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 to-transparent" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-forest-green rounded-xl p-5 border border-moss/20 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-moss/20 flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <p className="font-display font-medium text-cream text-sm">Halal Certified</p>
                    <p className="text-[10px] text-stone uppercase tracking-wider">Since 1986</p>
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
