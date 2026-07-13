
import { motion } from 'motion/react';
import { ArrowRight, Coffee, MapPin, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import ParticleCanvas from '@/components/ParticleCanvas';
import { getAssetUrl } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isBm = language === 'bm';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full overflow-hidden bg-cream pt-32 pb-16 lg:pt-40 lg:pb-24">
      {/* Interactive floating elements in the dark atmosphere */}
      <ParticleCanvas />

      {/* Cinematic Background Image Backdrop with Fading & Blur Filters */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src={getAssetUrl(theme === 'light' ? "/assets/putrajaya-lake-evening.jpg" : "/assets/putrajaya-lake-view.jpg")}
          alt="Putrajaya scenic backdrop"
          className={`w-full h-full object-cover scale-105 filter blur-[1px] transition-all duration-700 ease-in-out ${
            theme === 'light' ? 'opacity-45' : 'opacity-60'
          }`}
          referrerPolicy="no-referrer"
        />
        {/* Dual-layer fade-out and contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
        <div className="absolute inset-0 bg-cream/70 dark:bg-cream/75 backdrop-blur-[0.5px]" />
      </div>

      {/* Decorative ambient radial glows for dark theme richness */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-sunshine/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-kiwi/5 blur-[130px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-container flex flex-col items-center text-center relative z-10"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-crisp-carrot animate-pulse shadow-carrot-glow" />
          <span className="text-xs font-semibold text-deep-forest/80 uppercase tracking-[0.2em]">
            {isBm ? 'Sejak 1986' : 'Since 1986'}
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="font-display font-bold text-deep-forest leading-[1.05] tracking-tight text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] max-w-5xl"
        >
          Restoran Wawasan <br />
          <span className="bg-gradient-to-r from-sunshine via-honey to-crisp-carrot bg-clip-text text-transparent italic pr-2">Pak Usop</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="font-body text-deep-forest/70 text-lg md:text-xl leading-relaxed max-w-2xl mt-8 font-light">
          {isBm 
            ? 'Warisan rasa sejak Singapura 1986, kini di Putrajaya dengan hidangan sarapan klasik Nusantara, pakej mesyuarat dan katering yang mesra pejabat.'
            : 'A culinary legacy from Singapore since 1986, now in Putrajaya with beloved breakfast classics, Nusantara comfort dishes, and catering.'}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
          <Link
            to="/order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sunshine to-crisp-carrot text-white rounded-full font-semibold shadow-sunshine-glow hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>{t('order_now')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-deep-forest border border-white/10 rounded-full font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            {t('view_our_menu')}
          </a>
        </motion.div>

        {/* Highlights */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 lg:mt-24 w-full text-left">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-cream-dark/60 backdrop-blur-md rounded-3xl p-8 border border-white/[0.06] shadow-xl hover:border-sunshine/30 hover:shadow-[0_15px_35px_rgba(232,144,37,0.08)] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 border border-white/10">
                  <Icon className="w-6 h-6 text-sunshine" />
                </div>
                <h3 className="font-display font-semibold text-xl text-deep-forest">{item.title}</h3>
                <p className="text-sm text-deep-forest/60 mt-3 leading-relaxed font-light">{item.subtitle}</p>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
