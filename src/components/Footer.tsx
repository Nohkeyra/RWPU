import { Leaf, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  const NAV_LINKS = [
    { label: t('our_story'), href: '#story' },
    { label: t('menu'), href: '#menu' },
    { label: t('experience'), href: '#experience' },
    { label: t('reviews'), href: '#reviews' },
    { label: t('visit_us'), href: '#visit' },
  ];

  return (
    <footer className="bg-deep-forest border-t border-kiwi/20 pt-16 pb-8">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Leaf className="w-5 h-5 text-kiwi" />
              <span className="font-display font-medium text-2xl text-cream tracking-tight">{t('hero_title')}</span>
            </div>
            <span className="block font-accent font-light text-sm uppercase tracking-[0.2em] text-stone mt-2">Wawasan</span>
            <span className="block font-accent font-medium text-[10px] text-sunshine uppercase tracking-[0.15em] mt-3">
              {t('hero_subtitle')}
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col items-center md:items-start gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body font-light text-sm text-stone hover:text-kiwi transition-colors duration-300 py-1.5 px-3 -mx-3"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="text-center md:text-right">
            <span className="font-accent font-medium text-[10px] uppercase tracking-[0.15em] text-sunshine">
              {t('follow_us')}
            </span>
            <a
              href="https://www.facebook.com/Restoran-Wawasan-Pakusop-1057152710976512/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone hover:text-kiwi transition-colors duration-300 mt-2 justify-center md:justify-end py-2 px-3 -mx-3"
            >
              <Facebook className="w-4 h-4" />
              <span className="font-body font-light text-[13px]">Restoran Wawasan</span>
            </a>
          </div>
        </div>

        {/* Divider — brand gradient line */}
        <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-kiwi/30 to-transparent my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="font-body font-light text-[11px] text-stone/60 text-center md:text-left tracking-wide">
              &copy; {new Date().getFullYear()} Restoran Wawasan. {t('all_rights_reserved')}
            </p>
            <span className="hidden md:inline text-stone/30">|</span>
            <Link
              to="/admin"
              className="font-body font-light text-[11px] text-stone/60 hover:text-kiwi transition-colors duration-300 py-2 px-3 -mx-3 md:mx-0 tracking-wide"
            >
              {t('admin_login')}
            </Link>
          </div>
          <span className="font-accent font-medium text-[10px] uppercase tracking-[0.15em] text-kiwi">
            {t('halal_certified')}
          </span>
        </div>
      </div>
    </footer>
  );
}
