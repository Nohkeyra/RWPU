import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OrderForm from '@/components/OrderForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function OrderPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const initialData = location.state?.reorderData;

  return (
    <div className="min-h-screen bg-deep-forest">
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-12 bg-forest-green/80 backdrop-blur-2xl border-b border-cream/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-kiwi/20 border border-kiwi/30 flex items-center justify-center group-hover:bg-kiwi/30 group-hover:border-kiwi/60 transition-colors">
            <Leaf className="w-4 h-4 text-kiwi transition-colors" strokeWidth={2} />
          </div>
          <div>
            <span className="font-display font-semibold text-xl text-cream leading-none tracking-tight">
              Restoran
            </span>
            <span className="block font-accent text-[10px] text-kiwi/80 uppercase tracking-[0.15em] leading-tight mt-0.5">
              Wawasan
            </span>
          </div>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="text-stone hover:text-kiwi hover:bg-cream/5 rounded-lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </Link>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 pt-10">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-kiwi/60" />
              <span className="text-kiwi text-xs font-accent font-semibold tracking-[0.2em] uppercase">
                Catering
              </span>
              <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-kiwi/60" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-sunshine via-crisp-carrot to-tomato-burst bg-clip-text text-transparent">{t('catering_order')}</span>
            </h1>
            <p className="text-cream/70 text-lg max-w-xl mx-auto leading-relaxed">
              {t('order_subtitle')}
            </p>
          </div>

          <div className="nature-card shadow-[inset_0_2px_20px_rgba(0,0,0,0.2)]">
            <div className="h-1.5 bg-gradient-to-r from-moss via-fern via-sunshine to-crisp-carrot" />
            <div className="p-6 md:p-10 bg-gradient-to-b from-forest-green/30 to-transparent">
              <ErrorBoundary fallbackTitle="Catering Form Error">
                <OrderForm initialData={initialData} />
              </ErrorBoundary>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-5">
            {[
              { 
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                label: "Secure Booking"
              },
              { 
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                label: "Fast Response"
              },
              { 
                icon: "M5 13l4 4L19 7",
                label: "Quality Guaranteed"
              }
            ].map((item, i) => (
              <div key={i} className="nature-card p-5 text-center group hover:border-moss/20 transition-all duration-500">
                <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-moss/10 flex items-center justify-center group-hover:bg-moss/20 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 text-moss group-hover:text-sage transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <p className="text-sm text-stone group-hover:text-cream/80 transition-colors font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-forest-green border-t border-cream/5 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-3 h-3 text-moss/50" />
            <span className="text-stone/60 text-xs tracking-[0.1em] uppercase">Restoran Wawasan</span>
            <Leaf className="w-3 h-3 text-moss/50" />
          </div>
          <p className="text-stone/40 text-sm">
            &copy; {new Date().getFullYear()} Restoran Wawasan. {t('all_rights_reserved')}.
          </p>
        </div>
      </footer>
    </div>
  );
}
