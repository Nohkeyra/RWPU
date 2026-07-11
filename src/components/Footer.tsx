import { Facebook, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

function BrandMark() {
  return (
    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sunshine via-honey to-crisp-carrot text-deep-forest flex items-center justify-center shadow-sunshine-glow border border-white/10">
      <span className="font-display font-bold text-xl leading-none">W</span>
    </div>
  );
}

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
    <footer className="bg-deep-forest border-t border-sunshine/12 pt-16 pb-8">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-10 items-start">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <BrandMark />
              <div>
                <span className="block font-display font-semibold text-2xl text-cream tracking-tight">
                  Restoran Wawasan
                </span>
                <span className="block font-accent font-medium text-[10px] text-sunshine uppercase tracking-[0.22em] mt-1">
                  Pak Usop • Est. 1986
                </span>
              </div>
            </div>
            <p className="text-stone/75 text-sm leading-relaxed max-w-md mt-5 mx-auto lg:mx-0">
              Heritage Malaysian comfort food, meeting packs, and catering with a lake-view setting in the heart of Putrajaya.
            </p>
          </div>

          <nav className="flex flex-col items-center lg:items-start gap-1">
            <span className="font-accent font-semibold text-[10px] uppercase tracking-[0.18em] text-sunshine mb-3">
              Explore
            </span>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body font-light text-sm text-stone hover:text-sunshine transition-colors duration-300 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="text-center lg:text-right">
            <span className="font-accent font-medium text-[10px] uppercase tracking-[0.15em] text-sunshine">
              {t('contact_us')}
            </span>
            <div className="mt-4 space-y-3 text-sm text-stone/85">
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <MapPin className="w-4 h-4 text-sunshine" />
                <span>Unit 3, Level B3, Menara PjH, Presint 2</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Phone className="w-4 h-4 text-sunshine" />
                <a href="tel:+60178582642" className="hover:text-cream transition-colors">+60 17-858 2642</a>
              </div>
              <a
                href="https://www.facebook.com/Restoran-Wawasan-Pakusop-1057152710976512/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone hover:text-sunshine transition-colors duration-300 mt-2 justify-center lg:justify-end"
              >
                <Facebook className="w-4 h-4" />
                <span className="font-body font-light text-[13px]">Restoran Wawasan</span>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-sunshine/25 to-transparent my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="font-body font-light text-[11px] text-stone/60 text-center md:text-left tracking-wide">
              &copy; {new Date().getFullYear()} Restoran Wawasan. {t('all_rights_reserved')}
            </p>
            <span className="hidden md:inline text-stone/30">|</span>
            <Link
              to="/admin"
              className="font-body font-light text-[11px] text-stone/60 hover:text-sunshine transition-colors duration-300 py-2 px-3 -mx-3 md:mx-0 tracking-wide"
            >
              {t('admin_login')}
            </Link>
          </div>
          <span className="font-accent font-medium text-[10px] uppercase tracking-[0.15em] text-sunshine">
            {t('halal_certified')}
          </span>
        </div>
      </div>
    </footer>
  );
}
