import { useState, useEffect } from 'react';
import { Menu, Languages, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useLanguage } from '@/context/LanguageContext';
import { getAssetUrl } from '@/lib/utils';
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

function BrandMark() {
  return (
    <img
      src={getAssetUrl("/assets/wawasan_logo.jpg")}
      alt="Restoran Wawasan Logo"
      className="w-10 h-10 rounded-xl border border-white/20 shadow-lg object-cover"
      referrerPolicy="no-referrer"
    />
  );
}

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

  const toggleLanguage = () => setLanguage(language === 'en' ? 'bm' : 'en');

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
            ? 'glass-header py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <BrandMark />
            <div>
              <span className="font-display font-semibold text-xl text-deep-forest leading-none tracking-tight">
                Restoran Wawasan
              </span>
              <span className="block font-accent text-[10px] text-crisp-carrot uppercase tracking-[0.18em] leading-tight mt-0.5 font-bold">
                Pak Usop
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-deep-forest/80 hover:text-sunshine transition-colors"
              >
                {link.label.charAt(0).toUpperCase() + link.label.slice(1)}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-deep-forest/70 hover:text-deep-forest hover:bg-white/5 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs tracking-wider">{language === 'en' ? 'BM' : 'EN'}</span>
            </button>

            {/* Client login / account */}
            <button
              onClick={handleAuthClick}
              className="p-2 text-deep-forest/70 hover:text-deep-forest hover:bg-white/5 rounded-lg transition-all duration-300"
              aria-label={currentUser ? 'Account' : 'Sign in'}
            >
              {currentUser ? (
                <div className="w-8 h-8 rounded-full bg-crisp-carrot text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName?.slice(0, 2).toUpperCase() || currentUser.email?.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>

            <Link
              to="/order"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sunshine to-crisp-carrot text-white rounded-full font-bold text-sm hover:shadow-xl transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5"
            >
              {t('order_now')}
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 text-deep-forest hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS.map((link) => ({ 
          ...link, 
          label: link.label.charAt(0).toUpperCase() + link.label.slice(1) 
        }))}
        currentUser={currentUser}
        onAuthClick={handleAuthClick}
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
