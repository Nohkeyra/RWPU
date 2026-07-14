import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import AuthModal from '@/components/AuthModal';
import { getAssetUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { LogIn, Compass, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const { language } = useLanguage();
  
  const tLocal = (en: string, bm: string) => (language === 'bm' ? bm : en);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/order', { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0B0B0C] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={getAssetUrl('/assets/teh-tarik.jpg')}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        <div className="w-48 h-48 mb-8 flex items-center justify-center">
          <img 
            src={getAssetUrl('/assets/wawasan_logo.jpg')} 
            alt="Logo" 
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
        
        <h1 className="font-display text-4xl text-[#F4F4F6] font-bold text-center mb-2 tracking-wide">
          Restoran Wawasan
        </h1>
        <p className="text-[#C5A059] font-sans text-lg mb-12 uppercase tracking-[0.2em] font-medium">
          Catering Services
        </p>

        <div className="w-full space-y-4 font-sans">
          <button 
            onClick={() => setAuthOpen(true)}
            className="w-full py-4 bg-[#C5A059] rounded-xl text-[#0B0B0C] font-bold text-lg shadow-lg shadow-[#C5A059]/20 hover:bg-[#E2C792] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            {tLocal('Sign In / Register', 'Log Masuk / Daftar')}
          </button>

          <button 
            onClick={() => navigate('/order')}
            className="w-full py-4 bg-transparent border-2 border-[#C5A059] rounded-xl text-[#C5A059] font-bold text-lg hover:bg-[#C5A059]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
            {tLocal('Order Now (Guest)', 'Pesan Sekarang (Pelawat)')}
          </button>
          
          <button 
            onClick={() => navigate('/home', { replace: true })}
            className="w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-[#F4F4F6] font-semibold text-lg hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#8E8E93]" />
            {tLocal('Explore Menu & Story', 'Teroka Menu & Cerita')}
          </button>
        </div>
      </div>

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={() => navigate('/order', { replace: true })}
      />
    </div>
  );
}
