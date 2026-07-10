import { useState, useEffect } from 'react';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useLanguage } from '@/context/LanguageContext';
import { Leaf, Menu, Languages, User as UserIcon } from 'lucide-react';
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
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? 'bg-deep-forest/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-kiwi/15 border border-kiwi/30 flex items-center justify-center group-hover:bg-kiwi/25 group-hover:border-kiwi/60 transition-all duration-300">
              <Leaf className="w-5 h-5 text-kiwi" strokeWidth={2} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-lg text-cream leading-none tracking-tight">
                Restoran
              </span>
              <span className="block font-accent text-[10px] text-kiwi/80 uppercase tracking-[0.15em] leading-tight mt-0.5">
                Wawasan
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 font-body font-medium text-sm text-cream/80 hover:text-cream transition-colors duration-300 rounded-lg hover:bg-cream/5"
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-cream/70 hover:text-cream hover:bg-cream/5 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs tracking-wider">{language === 'en' ? 'BM' : 'EN'}</span>
            </button>
            
            {/* Auth */}
            <button
              onClick={handleAuthClick}
              className="p-2 text-cream/70 hover:text-kiwi hover:bg-cream/5 rounded-lg transition-all duration-300"
              aria-label={currentUser ? 'Open profile' : 'Sign in'}
            >
              {currentUser ? (
                <div className="w-8 h-8 rounded-full bg-sunshine text-deep-forest flex items-center justify-center font-bold text-xs shadow-sunshine-glow">
                  {currentUser.displayName?.slice(0, 2) || currentUser.email?.slice(0, 2)}
                </div>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button — sunshine primary */}
            <Link
              to="/order"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-sunshine text-deep-forest rounded-lg font-semibold text-sm hover:bg-honey transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5"
            >
              {t('order_now')}
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-cream hover:bg-cream/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
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
