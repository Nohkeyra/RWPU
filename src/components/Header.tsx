import { useState, useEffect } from 'react';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useLanguage } from '@/context/LanguageContext';
import { Utensils, Menu, X, Languages, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import MobileMenu from './MobileMenu';
import AuthModal from './AuthModal';
import UserProfileDashboard from './UserProfileDashboard';

const NAV_LINKS = [
  { label: 'story', href: '#story' },
  { label: 'menu', href: '#menu' },
  { label: 'experience', href: '#experience' },
  { label: 'reviews', href: '#reviews' },
  { label: 'visit', href: '#visit' },
];

export default function Header() {
  const isScrolled = useHeaderScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDashboardOpen, setProfileDashboardOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bm' : 'en');
  };

  const handleAuthClick = () => {
    if (currentUser) {
      setProfileDashboardOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] h-[80px] flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          isScrolled
            ? 'bg-charcoal/90 backdrop-blur-md border-b border-warm-gold/15 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Utensils className="w-4 h-4 text-warm-gold" strokeWidth={2} />
          <div>
            <span className="font-display font-semibold text-xl text-cream leading-none">
              Restoran
            </span>
            <span className="block font-body text-xs text-cream/60 leading-tight">
              Wawasan
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative font-body font-medium text-sm text-cream tracking-[0.02em] hover:text-warm-gold transition-colors duration-300 group"
            >
              {t(link.label)}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-warm-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA + Language Toggle + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-cream hover:text-warm-gold transition-colors duration-300 text-sm font-medium"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            <span className="uppercase tracking-wider">{language === 'en' ? 'BM' : 'EN'}</span>
          </button>
          
          {/* Auth Button */}
          <button
            onClick={handleAuthClick}
            className="p-2 text-cream hover:text-warm-gold transition-colors duration-300 flex items-center justify-center"
            aria-label="User Profile"
          >
            {currentUser ? (
              <div className="w-8 h-8 rounded-full bg-warm-gold text-charcoal flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.displayName ? currentUser.displayName.slice(0, 2) : currentUser.email?.slice(0, 2)}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-cream/30 flex items-center justify-center group-hover:border-warm-gold transition-colors">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </button>

          <div className="hidden md:block w-[1px] h-6 bg-cream/20" />

          {/* Order Now Button */}
          <Link
            to="/order"
            className="hidden md:inline-flex items-center px-4 py-2.5 md:px-6 md:py-3 bg-warm-gold text-charcoal font-['Montserrat',sans-serif] font-medium text-[11px] md:text-[12px] uppercase tracking-[0.15em] hover:bg-[#E0BC74] hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_12px_rgba(212,168,83,0.2)]"
          >
            {t('order_now')}
          </Link>

          {/* Contact Us Link */}
          <a
            href="#visit"
            className="hidden lg:inline-flex items-center px-6 py-3 border border-cream/50 text-cream font-['Montserrat',sans-serif] font-medium text-[12px] uppercase tracking-[0.15em] hover:bg-cream/5 hover:border-cream/80 transition-all duration-300"
          >
            {t('contact_us')}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-cream p-2 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98]"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        links={NAV_LINKS.map(link => ({ ...link, label: t(link.label) }))}
      />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={() => setProfileDashboardOpen(true)}
      />
      
      <UserProfileDashboard 
        isOpen={profileDashboardOpen} 
        onClose={() => setProfileDashboardOpen(false)} 
        onReorder={(orderData) => {
          navigate('/order', { state: { reorderData: orderData } });
        }}
      />
    </>
  );
}
