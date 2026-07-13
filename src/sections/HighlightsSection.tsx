import { Coffee, MapPin, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

export default function HighlightsSection() {
  const { language } = useLanguage();
  const isBm = language === 'bm';

  const highlights = [
    {
      icon: Coffee,
      title: isBm ? 'Sarapan Legenda' : 'Legendary Breakfast',
      subtitle: isBm ? 'Lontong, soto, teh tarik dan banyak lagi.' : 'Lontong, soto, teh tarik and more.',
    },
    {
      icon: UtensilsCrossed,
      title: isBm ? 'Mesyuarat & Katering' : 'Meeting Packs & Catering',
      subtitle: isBm ? 'Sesuai untuk pejabat, agensi dan acara.' : 'Built for offices, agencies and events.',
    },
    {
      icon: MapPin,
      title: isBm ? 'Di Tengah Putrajaya' : 'In the Heart of Putrajaya',
      subtitle: isBm ? 'Menara PjH dengan suasana tasik yang indah.' : 'Menara PjH with a scenic lakeside feel.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-cream relative z-20">
      <div className="content-container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="highlight-card bg-cream-dark/60 backdrop-blur-md rounded-3xl p-8 border border-white/[0.06] shadow-lg hover:border-sunshine/30 hover:shadow-[0_15px_35px_rgba(232,144,37,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 border border-white/10">
                    <Icon className="w-6 h-6 text-sunshine" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-deep-forest">{item.title}</h3>
                  <p className="text-sm text-deep-forest/60 mt-3 leading-relaxed font-light">{item.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
