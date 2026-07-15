import { useState, useEffect } from 'react';
import { Menu, Languages, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
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
      className="w-12 h-12 object-contain shrink-0 mix-blend-multiply"
      referrerPolicy="no-referrer"
    />
  );
}

export default function Header() {
  const isScrolled = useHeaderScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
            ? 'glass-header pb-3 pt-[calc(0.75rem+var(--sat))]' 
            : 'bg-transparent pb-6 pt-[calc(1.5rem+var(--sat))]'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4 md:gap-6 lg:gap-8">
          <Link to="/home" className="flex items-center gap-3 group shrink-0">
            <BrandMark />
            <div className="shrink-0 flex flex-col justify-center">
              <span className="font-urban text-lg md:text-xl text-deep-forest leading-none tracking-wide">
                Restoran Wawasan
              </span>
              <span className="block font-graffiti text-sm md:text-base text-crisp-carrot leading-none -mt-1 ml-0.5">
                Pak Usop
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8 shrink-0">
            {NAV_LINKS.map((link) => {
              if (link.isButton) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sunshine to-crisp-carrot text-white rounded-full font-bold text-xs hover:shadow-xl transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5"
                  >
                    {t(link.label as Parameters<typeof t>[0])}
                  </Link>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-deep-forest/80 hover:text-sunshine transition-colors"
                >
                  {t(link.label as Parameters<typeof t>[0]) || link.label.charAt(0).toUpperCase() + link.label.slice(1)}
                </a>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-deep-forest/70 hover:text-deep-forest hover:/5 rounded-lg transition-all duration-300"
              aria-label={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-deep-forest animate-float" />
              ) : (
                <Sun className="w-5 h-5 text-sunshine animate-pulse" />
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-deep-forest/70 hover:text-deep-forest hover:/5 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs tracking-wider">{language === 'en' ? 'BM' : 'EN'}</span>
            </button>

            {/* Client login / account */}
            <button
              onClick={handleAuthClick}
              className="p-2 text-deep-forest/70 hover:text-deep-forest hover:/5 rounded-lg transition-all duration-300"
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
          </div>

          <div className="flex md:hidden items-center gap-1">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-deep-forest hover:/5 rounded-full transition-colors"
              aria-label={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-deep-forest" />
              ) : (
                <Sun className="w-5 h-5 text-sunshine" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="p-2.5 text-deep-forest hover:/5 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
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
