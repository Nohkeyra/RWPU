import { Award } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';
import { getAssetUrl } from '@/lib/utils';

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
    animation: 'fade-up',
    y: 40,
    duration: 1.0,
  });

  return (
    <section id="story" ref={sectionRef} className="section-padding bg-cream relative">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-5 order-2 lg:order-1" ref={imageRef}>
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] border border-white/[0.08] shadow-2xl bg-cream-dark">
                <img 
                  src={getAssetUrl("/assets/high-tea.jpg")} 
                  alt={language === 'bm' ? 'Kotak Katering Minum Petang' : 'High-Tea Catering Box'} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getAssetUrl('/assets/wawasan_logo.jpg');
                  }}
                />
              </div>
              
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-cream-dark/95 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl hidden sm:block max-w-[280px]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Award className="w-6 h-6 text-sunshine" strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="font-display font-medium text-deep-forest text-base leading-tight mb-1">
                      {language === 'bm' ? 'Halal & mesra keluarga' : 'Halal & family-friendly'}
                    </p>
                    <p className="text-[11px] text-deep-forest/50 uppercase tracking-[0.1em] font-semibold">
                      {language === 'bm' ? 'Sarapan, makan tengah hari, katering' : 'Breakfast, lunch, catering'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="story-animate flex justify-start mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-xs font-semibold text-deep-forest/80 uppercase tracking-[0.2em]">
                  {t('our_story')}
                </span>
              </div>
            </div>
            
            <h2 className="story-animate font-display font-bold text-[40px] md:text-[56px] text-deep-forest leading-[1.05] mb-8">
              {t('story_title')}
            </h2>
            
            <div className="space-y-6 mb-12">
              <p className="story-animate font-body text-lg text-deep-forest/70 leading-relaxed font-light">
                {t('story_p1')}
              </p>
              <p className="story-animate font-body text-lg text-deep-forest/70 leading-relaxed font-light">
                {t('story_p2')}
              </p>
              <p className="story-animate font-body text-lg text-deep-forest/70 leading-relaxed font-light">
                {t('story_p3')}
              </p>
            </div>
            
            <div className="story-animate grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span className="font-display font-bold text-4xl text-sunshine">
                    {stat.number}
                  </span>
                  <span className="block font-sans font-medium text-[11px] uppercase tracking-[0.1em] text-deep-forest/50 mt-3">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
