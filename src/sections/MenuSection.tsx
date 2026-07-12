import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

const MENU_ITEMS = [
  {
    nameEn: 'Asam Pedas',
    nameBm: 'Asam Pedas',
    descEn: 'Our #1 crowd favorite — spicy tamarind fish stew with tangy, bold flavors. A true Malay classic.',
    descBm: 'Kegemaran ramai #1 — rebusan ikan asam pedas dengan rasa masam dan berani yang ketara. Klasik Melayu sejati.',
    priceEn: 'From RM 8',
    priceBm: 'Daripada RM 8',
    image: `/assets/asam-pedas.jpg`,
  },
  {
    nameEn: 'Nasi Lemak',
    nameBm: 'Nasi Lemak',
    descEn: "Malaysia's national dish — fragrant coconut rice with sambal, anchovies, peanuts, cucumber & egg.",
    descBm: 'Hidangan kebangsaan Malaysia — nasi santan wangi bersama sambal, ikan bilis, kacang tanah, timun & telur.',
    priceEn: 'From RM 3',
    priceBm: 'Daripada RM 3',
    image: `/assets/nasi-lemak.jpg`,
  },
  {
    nameEn: 'Lontong Singapore',
    nameBm: 'Lontong Singapore',
    descEn: 'Compressed rice cakes in rich coconut vegetable curry with cabbage, long beans, and sambal.',
    descBm: 'Nasi himpit di dalam kuah lodeh sayur bersantan pekat bersama kuubisan, kacang panjang, dan sambal.',
    priceEn: 'From RM 7',
    priceBm: 'Daripada RM 7',
    image: `/assets/lontong-singapore.jpg`,
  },
  {
    nameEn: 'Mee Soto',
    nameBm: 'Mee Soto',
    descEn: 'Aromatic chicken noodle soup with shredded chicken, bean sprouts, and crispy fried shallots.',
    descBm: 'Sup mi ayam aromatik bersama carikan isi ayam, taugeh, dan bawang goreng garing.',
    priceEn: 'From RM 6',
    priceBm: 'Daripada RM 6',
    image: `/assets/mee-soto.jpg`,
  },
  {
    nameEn: 'Soto Ayam',
    nameBm: 'Soto Ayam',
    descEn: 'Rich, spiced chicken broth served with compressed rice cubes (nasi impit) and potato croquette.',
    descBm: 'Sup ayam berempah pekat dihidang bersama nasi himpit dan bergedil kentang.',
    priceEn: 'From RM 6',
    priceBm: 'Daripada RM 6',
    image: `/assets/soto-ayam.jpg`,
  },
  {
    nameEn: 'Nasi Campur',
    nameBm: 'Nasi Campur',
    descEn: 'Mixed rice with your choice of daily freshly cooked dishes, from curries to stir-fried greens.',
    descBm: 'Nasi putih berlauk dengan pilihan hidangan segar harian, dari kari hingga sayur tumis.',
    priceEn: 'Various',
    priceBm: 'Pelbagai',
    image: `/assets/nasi-campur.jpg`,
  },
  {
    nameEn: 'Teh Tarik',
    nameBm: 'Teh Tarik',
    descEn: 'Classic Malaysian pulled black tea with sweet condensed milk, frothed to perfection.',
    descBm: 'Teh tarik hitam klasik Malaysia dengan susu pekat manis, berbuih sempurna.',
    priceEn: 'From RM 2.50',
    priceBm: 'Daripada RM 2.50',
    image: `/assets/teh-tarik.jpg`,
  },
];

export default function MenuSection() {
  const { t, language } = useLanguage();
  const isBm = language === 'bm';

  const headerRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 30,
    childSelector: '.menu-header',
    stagger: 0.15,
  });

  const gridRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 30,
    childSelector: '.menu-card',
    stagger: 0.1,
  });

  return (
    <section id="menu" className="section-padding bg-cream relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="content-container">
        
        <div ref={headerRef} className="text-center mb-16">
          <div className="menu-header flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs font-semibold text-deep-forest/80 uppercase tracking-[0.2em]">
                {t('our_menu')}
              </span>
            </div>
          </div>
          <h2 className="menu-header font-display font-bold text-[40px] md:text-[56px] text-deep-forest leading-[1.05] mb-6">
            {t('menu_title')}
          </h2>
          <p className="menu-header font-body text-lg text-deep-forest/70 leading-relaxed max-w-[600px] mx-auto font-light">
            {t('menu_subtitle')}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENU_ITEMS.map((item) => (
            <div key={item.nameEn} className="menu-card group relative bg-cream-dark/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/[0.06] hover:border-sunshine/30 hover:shadow-[0_20px_50px_rgba(232,144,37,0.1)] hover:-translate-y-1 transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={isBm ? item.nameBm : item.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6 md:p-8 relative bg-transparent">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display font-bold text-2xl text-deep-forest">
                    {isBm ? item.nameBm : item.nameEn}
                  </h3>
                </div>
                <p className="font-body text-deep-forest/70 leading-relaxed mb-6 font-light text-sm h-[60px] overflow-hidden line-clamp-3">
                  {isBm ? item.descBm : item.descEn}
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                  <span className="font-sans font-bold text-sunshine">
                    {isBm ? item.priceBm : item.priceEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
