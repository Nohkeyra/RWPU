import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OrderForm from '@/components/OrderForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAssetUrl } from '@/lib/utils';

function BrandMark() {
  return (
    <img
      src={getAssetUrl("/assets/wawasan_logo.jpg")}
      alt="Restoran Wawasan Logo"
      className="w-9 h-9 rounded-xl border border-white/20 shadow-lg object-cover"
      referrerPolicy="no-referrer"
    />
  );
}

export default function OrderPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const initialData = location.state?.reorderData;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream pattern-dots">
        <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-white/5 shadow-sm pt-[var(--sat)]">
          <div className="flex items-center justify-between px-6 md:px-12 h-[76px]">
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
            <Link to="/">
              <Button variant="ghost" className="text-stone hover:text-crisp-carrot hover:bg-white/10 rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </Link>
          </div>
        </header>

        <main className="pt-[calc(76px+var(--sat)+2rem)] pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 pt-10">
              <span className="inline-flex items-center gap-3 mb-5 px-4 py-2 rounded-full bg-sunshine/10 text-sunshine text-sm font-bold border border-sunshine/20">
                <span className="w-2 h-2 rounded-full bg-crisp-carrot animate-pulse" />
                Online Ordering Available
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-deep-forest mb-4">
                Place Your Order
              </h1>
              <p className="text-stone max-w-2xl mx-auto font-light">
                Enjoy authentic Malay cuisine from the comfort of your home. Delivery available within Putrajaya area.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { label: 'Prep Time', value: '15-20 min' },
                { label: 'Delivery', value: '30-45 min' },
                { label: 'Min Order', value: 'RM 25' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 rounded-2xl bg-cream-dark/60 backdrop-blur-md border border-white/[0.06] shadow-xl">
                  <div className="text-lg font-bold text-sunshine">{stat.value}</div>
                  <div className="text-xs text-stone uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <OrderForm initialData={initialData} />
          </div>
        </main>

        <footer className="bg-charcoal border-t border-white/5 py-8 mt-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sunshine" />
              <span className="text-deep-forest/60 text-xs tracking-[0.18em] uppercase font-semibold">
                Restoran Wawasan Pak Usop
              </span>
            </div>
            <p className="text-deep-forest/40 text-sm">
              © 2026 All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
