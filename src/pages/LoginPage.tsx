import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebaseConfig';
import AuthModal from '@/components/AuthModal';
import { getAssetUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { LogIn, Compass, ShoppingBag, Shield, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const tLocal = (en: string, bm: string) => (language === 'bm' ? bm : en);

  useEffect(() => {
    // Keep splash animation visible for 2 seconds for a premium native feel
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-cream overflow-hidden">
      {/* Top Left Theme Toggle */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 md:p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-deep-forest hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-deep-forest animate-float" />
          ) : (
            <Sun className="w-5 h-5 text-sunshine animate-pulse" />
          )}
        </button>
      </div>

      {/* Background Image with elegant Ken Burns scale animation */}
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.22 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          src={getAssetUrl('/assets/teh-tarik.jpg')}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/80 to-transparent" />
      </div>

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Pulsing glow ring behind the logo */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.25, 0.12] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute w-64 h-64 bg-sunshine/10 rounded-full blur-xl"
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 110,
                  damping: 14,
                  delay: 0.15
                }}
                className="w-56 h-56 flex items-center justify-center z-10"
              >
                <img 
                  src={getAssetUrl('/assets/wawasan_logo.jpg')} 
                  alt="Logo" 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </motion.div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="font-display text-4xl font-black text-deep-forest mt-6 tracking-tight flex flex-col items-center"
            >
              Restoran Wawasan
              <span className="font-graffiti text-2xl text-crisp-carrot leading-none mt-1 rotate-[-1.5deg]">
                Pak Usop
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.8, 0.35] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.8 }}
              className="mt-8 text-sunshine font-accent text-xs uppercase tracking-[0.3em] font-semibold"
            >
              {tLocal('Loading authentic flavors...', 'Memuatkan cita rasa asli...')}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="login-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md px-6 flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="w-44 h-44 mb-4 flex items-center justify-center"
            >
              <img 
                src={getAssetUrl('/assets/wawasan_logo.jpg')} 
                alt="Logo" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-display text-4xl sm:text-5xl font-black text-deep-forest text-center mb-1 tracking-tight flex flex-col items-center"
            >
              Restoran Wawasan
              <span className="font-graffiti text-2xl sm:text-3xl text-crisp-carrot leading-none mt-1 rotate-[-1.5deg]">
                Pak Usop
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sunshine font-accent text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-8"
            >
              Catering Services
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full space-y-4 font-display"
            >
              <button 
                onClick={() => {
                  if (auth.currentUser) {
                    sessionStorage.setItem('wawasan_session_started', 'true');
                    navigate('/home');
                  } else {
                    setAuthOpen(true);
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-sunshine to-crisp-carrot rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-sunshine-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer duration-300 hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5" />
                {tLocal('Sign In / Register', 'Log Masuk / Daftar')}
              </button>

              <button 
                onClick={() => {
                  sessionStorage.setItem('wawasan_session_started', 'true');
                  sessionStorage.setItem('wawasan_guest_allowed', 'true');
                  navigate('/order');
                }}
                className="w-full py-4 bg-transparent border-2 border-sunshine/50 rounded-xl text-sunshine font-bold text-lg hover:bg-sunshine/10 hover:border-sunshine transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer duration-300 hover:scale-[1.02]"
              >
                <ShoppingBag className="w-5 h-5 text-sunshine" />
                {tLocal('Order Now (Guest)', 'Pesan Sekarang (Pelawat)')}
              </button>
              
              <button 
                onClick={() => {
                  sessionStorage.setItem('wawasan_session_started', 'true');
                  sessionStorage.setItem('wawasan_guest_allowed', 'true');
                  navigate('/home', { replace: true });
                }}
                className="w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-deep-forest font-semibold text-lg hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer duration-300 hover:scale-[1.02]"
              >
                <Compass className="w-5 h-5 text-stone" />
                {tLocal('Explore Menu & Story', 'Teroka Menu & Cerita')}
              </button>
            </motion.div>

            {/* Discreet Admin Login Access */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => navigate('/admin')}
              className="mt-12 text-deep-forest/5 hover:text-deep-forest/25 transition-all p-2.5 rounded-full cursor-pointer focus:outline-none"
              aria-label="Admin Access"
              id="admin-secret-trigger"
            >
              <Shield className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={() => {
          sessionStorage.setItem('wawasan_session_started', 'true');
          navigate('/home', { replace: true });
        }}
      />
    </div>
  );
}
