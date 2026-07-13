
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import ParticleCanvas from '@/components/ParticleCanvas';
import { getAssetUrl } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isBm = language === 'bm';

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 120]);

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
        <motion.img
          src={getAssetUrl(theme === 'light' ? "/assets/putrajaya-lake-evening.jpg" : "/assets/putrajaya-lake-view.jpg")}
          alt="Putrajaya scenic backdrop"
          style={{ y }}
          className={`w-full h-full object-cover scale-110 filter blur-[1px] transition-all duration-700 ease-in-out ${
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
          className="font-bold text-deep-forest leading-[1.05] tracking-tight text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] max-w-5xl"
        >
          <span className="font-celtic block mb-2 sm:mb-4">Restoran Wawasan</span>
          <span className="font-celtic block bg-gradient-to-r from-sunshine via-honey to-crisp-carrot bg-clip-text text-transparent pr-2">Pak Usop</span>
        </motion.h1>

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
      </motion.div>
    </section>
  );
}
