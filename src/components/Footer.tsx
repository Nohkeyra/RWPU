import { Facebook, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getAssetUrl } from '@/lib/utils';

function BrandMark() {
  return (
    <img
      src={getAssetUrl("/assets/wawasan_logo.jpg")}
      alt="Restoran Wawasan Logo"
      className="w-11 h-11 rounded-xl border border-white/10 shadow-lg object-cover"
      referrerPolicy="no-referrer"
    />
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
    <footer className="bg-charcoal border-t border-white/5 pt-20 pb-8 text-cream">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start mb-16">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div>
                <span className="font-display font-semibold text-2xl text-cream tracking-tight">
                  Restoran Wawasan
                </span>
                <span className="block font-sans font-bold text-[10px] text-sunshine uppercase tracking-[0.2em] mt-1">
                  Pak Usop
                </span>
              </div>
            </div>
            <p className="font-body text-cream/70 text-sm max-w-sm leading-relaxed font-light">
              A culinary legacy from Singapore since 1986, now serving authentic Nusantara comfort food in the heart of Putrajaya.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/WawasanRestoran" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center text-cream/70 hover:bg-sunshine hover:text-white transition-all duration-300 border border-cream/10 hover:border-sunshine">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-display font-semibold text-lg text-cream">Explore</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-cream/60 hover:text-sunshine transition-colors text-sm font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-display font-semibold text-lg text-cream">Contact</h4>
            <div className="space-y-4">
              <a href="tel:+60178582642" className="flex items-start gap-3 group text-cream/60 hover:text-sunshine transition-colors">
                <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-sm font-light leading-relaxed">
                  +60 17-858 2642 <br /> (Pak Usop)
                </span>
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Restoran+Wawasan+Pak+Usop+Putrajaya" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group text-cream/60 hover:text-sunshine transition-colors">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-sm font-light leading-relaxed">
                  Menara PjH, Presint 2, <br /> Unit 3, Level B3, <br /> 62100 Putrajaya
                </span>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-cream/40">
          <p>© {new Date().getFullYear()} Restoran Wawasan Pak Usop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/order" className="hover:text-cream transition-colors">Order Online</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
