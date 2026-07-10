import { Sparkles, Heart, Flame, HandHeart } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import PrincipleCard from '@/components/PrincipleCard';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

const PRINCIPLES = [
  {
    icon: Sparkles,
    name: 'Cleanliness',
    malayName: 'Kebersihan',
    descriptionEn: 'Impeccable standards in every corner. A spotless environment for your dining comfort.',
    descriptionBm: 'Standard tanpa cela di setiap sudut. Persekitaran yang bersih untuk keselesaan menjamu selera anda.',
  },
  {
    icon: Heart,
    name: 'Excellent Service',
    malayName: 'Servis Terbaik',
    descriptionEn: 'Warm, attentive hospitality that makes every guest feel like family.',
    descriptionBm: 'Layanan yang mesra dan penuh perhatian yang membuatkan setiap tetamu merasa seperti keluarga.',
  },
  {
    icon: Flame,
    name: 'Lasting Taste',
    malayName: 'Rasa Kekal',
    descriptionEn: 'Recipes perfected over decades, delivering unforgettable flavors in every bite.',
    descriptionBm: 'Resipi yang disempurnakan berdekad-dekad lamanya, memberikan rasa yang tidak dapat dilupakan.',
  },
  {
    icon: HandHeart,
    name: 'Affordable Prices',
    malayName: 'Harga Berpatutan',
    descriptionEn: 'Exceptional quality at prices that welcome everyone — from ministers to families.',
    descriptionBm: 'Kualiti luar biasa pada harga yang mengalu-alukan semua orang — dari menteri hingga keluarga.',
  },
];

export default function ExperienceSection() {
  const { language, t } = useLanguage();
  
  const imageRef = useScrollTrigger<HTMLDivElement>({
    animation: 'scale-up',
    duration: 1.2,
  });

  const contentRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    childSelector: '.exp-animate',
    stagger: 0.15,
  });

  const gridRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 40,
    childSelector: '.principle-card',
    stagger: 0.15,
    delay: 0.5,
  });

  return (
    <section id="experience" className="relative">
      {/* Full-Width Image Band */}
      <div ref={imageRef} className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
        <img
          src={`/assets/putrajaya-lake-view.jpg`}
          alt="Putrajaya view"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-forest via-deep-forest/50 to-forest-green" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <span className="font-accent text-kiwi text-sm uppercase tracking-[0.2em] font-medium">Our Promise</span>
            <h2 className="font-display font-bold text-cream text-4xl md:text-6xl mt-4">
              <span className="bg-gradient-to-r from-sunshine via-crisp-carrot to-tomato-burst bg-clip-text text-transparent">Four</span>{' '}
              Principles
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-forest-green section-padding">
        <div className="content-container">
          <div ref={contentRef} className="text-center mb-16">
            <div className="exp-animate flex justify-center">
              <SectionLabel text={t('experience_title')} light />
            </div>
            <h2 className="exp-animate font-display font-semibold text-[32px] md:text-[48px] text-cream leading-[1.1] mb-6">
              {t('more_than_meal')}
            </h2>
            <p className="exp-animate font-body font-light text-lg text-cream/60 leading-relaxed max-w-[560px] mx-auto">
              {t('experience_p1')}
            </p>
          </div>

          {/* Principles Grid - Large Cards */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINCIPLES.map((p) => (
              <div key={p.name} className="principle-card">
                <PrincipleCard
                  icon={p.icon}
                  name={p.name}
                  malayName={p.malayName}
                  description={language === 'bm' ? p.descriptionBm : p.descriptionEn}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
