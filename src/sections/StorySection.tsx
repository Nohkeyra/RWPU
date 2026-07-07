import SectionLabel from '@/components/SectionLabel';
import Button from '@/components/Button';
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
    <section id="story" ref={sectionRef} className="section-padding bg-cream">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Column */}
          <div>
            <div className="story-animate">
              <SectionLabel text={t('our_story')} />
            </div>
            <h2 className="story-animate font-display font-semibold text-[32px] md:text-[48px] text-charcoal leading-[1.1] mb-8">
              {t('story_title')}
            </h2>
            <p className="story-animate font-body font-light text-lg text-deep-brown/80 leading-relaxed mb-5">
              {t('story_p1')}
            </p>
            <p className="story-animate font-body font-light text-lg text-deep-brown/80 leading-relaxed mb-5">
              {t('story_p2')}
            </p>
            <p className="story-animate font-body font-light text-lg text-deep-brown/80 leading-relaxed mb-10">
              {t('story_p3')}
            </p>

            {/* Stats */}
            <div className="story-animate flex flex-wrap gap-8 md:gap-12 mb-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span className="font-display font-medium text-4xl text-warm-gold tracking-tight">
                    {stat.number}
                  </span>
                  <span className="block font-['Montserrat',sans-serif] font-medium text-[11px] uppercase tracking-[0.15em] text-warm-gray mt-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="story-animate">
              <Button variant="primary" href="#menu">
                {t('explore_menu')}
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={`/assets/story-interior.jpg`}
                alt="Restoran Wawasan Pak Usop interior with food display"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            {/* Decorative gold border offset */}
            <div
              className="absolute -bottom-3 -right-3 w-full h-full border-[0.5px] border-warm-gold/60 pointer-events-none"
              style={{ zIndex: -1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
