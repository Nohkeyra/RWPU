import { useState, useEffect } from 'react';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, Languages, User as UserIcon } from 'lucide-react';
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

function BrandMark() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sunshine via-honey to-crisp-carrot text-deep-forest flex items-center justify-center shadow-sunshine-glow border border-white/10">
      <span className="font-display font-bold text-lg leading-none">W</span>
    </div>
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
            ? 'bg-deep-forest/92 backdrop-blur-xl border-b border-sunshine/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
            : 'bg-gradient-to-b from-deep-forest/60 to-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-[76px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <BrandMark />
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-lg text-cream leading-none tracking-tight">
                Restoran Wawasan
              </span>
              <span className="block font-accent text-[10px] text-sunshine/85 uppercase tracking-[0.22em] leading-tight mt-1">
                Pak Usop • Putrajaya
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.03] border border-white/[0.06] px-3 py-2 backdrop-blur-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 font-body font-medium text-sm text-cream/78 hover:text-cream transition-colors duration-300 rounded-full hover:bg-white/[0.05]"
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-cream/70 hover:text-cream hover:bg-white/[0.05] rounded-full transition-all duration-300 text-sm font-medium border border-white/[0.06]"
            >
              <Languages className="w-4 h-4" />
              <span className="uppercase text-xs tracking-wider">{language === 'en' ? 'BM' : 'EN'}</span>
            </button>

            <button
              onClick={handleAuthClick}
              className="p-2.5 text-cream/70 hover:text-sunshine hover:bg-white/[0.05] rounded-full transition-all duration-300 border border-white/[0.04]"
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

            <Link
              to="/order"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-sunshine text-deep-forest rounded-full font-semibold text-sm hover:bg-honey transition-all duration-300 hover:shadow-sunshine-glow hover:-translate-y-0.5"
            >
              {t('order_now')}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 text-cream hover:bg-white/[0.05] rounded-full transition-colors border border-white/[0.06]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS.map((link) => ({ ...link, label: t(link.label) }))}
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
