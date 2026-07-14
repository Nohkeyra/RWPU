
import { motion, useScroll, useTransform } from 'motion/react';
import ParticleCanvas from '@/components/ParticleCanvas';
import { getAssetUrl } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const { theme } = useTheme();

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
    <section className="relative w-full overflow-hidden bg-cream pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-[100svh] flex flex-col justify-end">
      {/* Cinematic Background Image Backdrop */}
      <div className="absolute top-0 left-0 right-0 w-full h-[65vh] md:h-full z-0 overflow-hidden">
        <motion.img
          src={getAssetUrl(theme === 'light' ? "/assets/putrajaya-lake-evening.jpg" : "/assets/putrajaya-lake-view.jpg")}
          alt="Putrajaya scenic backdrop"
          style={{ y }}
          className="w-full h-full object-cover object-top md:object-center filter transition-all duration-700 ease-in-out opacity-100"
          referrerPolicy="no-referrer"
        />
        {/* Gradient to blend with the content section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 md:h-64 bg-gradient-to-t from-cream via-cream/80 to-transparent" />
      </div>

      {/* Interactive floating elements */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Decorative ambient radial glows for dark theme richness */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-sunshine/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-kiwi/5 blur-[130px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-container flex flex-col items-center text-center relative z-10 w-full pb-8 md:pb-12 mt-auto"
      >
        <motion.div 
          variants={itemVariants}
          className="mt-12 animate-bounce opacity-60 text-deep-forest"
        >
          <div className="w-5 h-8 border-2 border-deep-forest/40 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-deep-forest/60 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
