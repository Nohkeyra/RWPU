
import { motion, useScroll, useTransform } from 'motion/react';
import { getAssetUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
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
    <section className="relative w-full overflow-hidden bg-cream pt-20 pb-12 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px] flex flex-col justify-center items-center">
      {/* Food-Centric Backdrop */}
      <div className="absolute top-0 left-0 right-0 w-full h-full z-0 overflow-hidden bg-charcoal">
        <motion.img
          src={getAssetUrl("/assets/nasi-lemak.jpg")}
          alt="Appetizing Nasi Lemak"
          style={{ y, scale: 1.05 }}
          className="w-full h-full object-cover object-center filter opacity-60 transition-all duration-700 ease-in-out"
          referrerPolicy="no-referrer"
        />
        {/* Wawasan Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-charcoal/40 to-transparent mix-blend-multiply" />
        {/* Geometric Star Pattern Overlay */}
        <div className="absolute inset-0 pattern-dots opacity-20" />
      </div>

      {/* Decorative ambient radial glows */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-sunshine/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-crisp-carrot/20 blur-[130px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-container flex flex-col items-center text-center relative z-10 w-full mt-auto mb-12"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <img 
            src={getAssetUrl("/assets/wawasan_logo.jpg")} 
            alt="Restoran Wawasan Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl mx-auto rounded-full border-4 border-cream/20"
          />
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-4 drop-shadow-lg"
        >
          {t('Bold. Fresh. Authentic.', 'Tegas. Segar. Asli.')}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-cream/90 max-w-2xl mx-auto font-medium mb-8 drop-shadow-md"
        >
          {t('Experience the true taste of heritage at Restoran Wawasan. Est. 1986.', 'Alami rasa warisan sebenar di Restoran Wawasan. Sejak 1986.')}
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex gap-4">
          <a href="#menu" className="px-8 py-3.5 bg-sunshine text-white rounded-full font-bold text-sm md:text-base hover:bg-crisp-carrot transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            {t('Explore Menu', 'Lihat Menu')}
          </a>
          <a href="/#/order" className="px-8 py-3.5 bg-cream/10 backdrop-blur-md border border-cream/30 text-white rounded-full font-bold text-sm md:text-base hover:bg-cream/20 transition-colors shadow-lg hover:-translate-y-0.5">
            {t('Order Catering', 'Tempah Katering')}
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
}
