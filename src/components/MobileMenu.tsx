import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Languages, Shield, ArrowRight, User as UserIcon, Sun, Moon } from 'lucide-react';
import type { User } from 'firebase/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  currentUser?: User | null;
  onAuthClick?: () => void;
}

export default function MobileMenu({ isOpen, onClose, links, currentUser, onAuthClick }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bm' : 'en');
  };

  useEffect(() => {
    if (!overlayRef.current || !itemsRef.current) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto',
      });
      gsap.fromTo(
        itemsRef.current.children,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        pointerEvents: 'none',
      });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleAuth = () => {
    if (onAuthClick) onAuthClick();
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1100] opacity-0 pointer-events-none md:hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="absolute inset-0 backdrop-blur-xl" />
      
      <div className="relative h-full flex flex-col p-6 pt-20">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-deep-forest/10 flex items-center justify-center text-deep-forest"
        >
          ✕
        </button>

        <nav ref={itemsRef} className="flex-1 flex flex-col gap-1 overflow-y-auto pb-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-3xl font-display font-bold text-deep-forest py-3 border-b border-deep-forest/10 hover:text-sunshine transition-colors"
            >
              {link.label}
            </a>
          ))}
          
          <Link
            to="/order"
            onClick={onClose}
            className="mt-6 w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sunshine to-crisp-carrot text-white font-bold rounded-full hover:shadow-sunshine-glow hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            {t('order_now')}
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* User Account Login */}
          <button
            onClick={handleAuth}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 border border-deep-forest/20 text-deep-forest rounded-full hover:bg-deep-forest/5 transition-all text-sm font-medium"
          >
            {currentUser ? (
              <>
                <div className="w-6 h-6 rounded-full bg-crisp-carrot text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.displayName?.slice(0, 2).toUpperCase() || currentUser.email?.slice(0, 2).toUpperCase()}
                </div>
                <span>Account / Dashboard</span>
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4 text-sunshine" />
                <span>Member Sign In</span>
              </>
            )}
          </button>

          {/* Day/Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 border border-deep-forest/20 text-deep-forest rounded-full hover:bg-deep-forest/5 transition-all text-sm font-medium"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-sunshine" />
                <span>Switch to Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-sunshine animate-pulse" />
                <span>Switch to Day Mode</span>
              </>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 border border-deep-forest/20 text-deep-forest rounded-full hover:bg-deep-forest/5 transition-all text-sm font-medium"
          >
            <Languages className="w-4 h-4 text-sunshine" />
            <span>{language === 'en' ? 'Tukar ke Bahasa Melayu' : 'Switch to English'}</span>
          </button>

          {/* Admin Link */}
          <Link
            to="/admin"
            onClick={onClose}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 border border-deep-forest/10 text-deep-forest/70 rounded-full hover:bg-deep-forest/5 transition-all text-sm"
          >
            <Shield className="w-4 h-4 text-sunshine" />
            <span>{t('admin_login')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
