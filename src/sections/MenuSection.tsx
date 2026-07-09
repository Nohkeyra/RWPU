import SectionLabel from '@/components/SectionLabel';
import FoodCard from '@/components/FoodCard';
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
    nameEn: 'Rendang Padang',
    nameBm: 'Rendang Padang',
    descEn: 'Slow-cooked beef in rich coconut milk and spices — tender, flavorful, and deeply satisfying.',
    descBm: 'Daging yang dimasak perlahan di dalam santan kaya dan rempah-ratus — empuk, berperisa, dan amat memuaskan.',
    priceEn: 'From RM 10',
    priceBm: 'Daripada RM 10',
    image: `/assets/rendang-padang.jpg`,
  },
  {
    nameEn: 'Rojak Singapore',
    nameBm: 'Rojak Singapore',
    descEn: 'Our famous Friday special — crispy tofu, cucumber, and bean sprouts tossed in rich prawn paste sauce.',
    descBm: 'Keistimewaan hari Jumaat kami yang terkenal — tauhu garing, timun, dan taugeh digaul bersama kuah petis udang khas.',
    priceEn: 'From RM 7',
    priceBm: 'Daripada RM 7',
    image: `/assets/rojak-singapore.jpg`,
  },
  {
    nameEn: 'Nasi Goreng Kampung',
    nameBm: 'Nasi Goreng Kampung',
    descEn: 'Village-style fried rice with crunchy anchovies, kangkung, and a perfectly fried egg on top.',
    descBm: 'Nasi goreng gaya kampung bersama ikan bilis rangup, kangkung, dan telur mata di atasnya.',
    priceEn: 'From RM 7',
    priceBm: 'Daripada RM 7',
    image: `/assets/nasi-goreng-kampung.jpg`,
  },
  {
    nameEn: 'Teh Tarik',
    nameBm: 'Teh Tarik',
    descEn: 'Authentic Malaysian pulled milk tea with a thick layer of frothy foam, perfectly brewed.',
    descBm: 'Teh tarik asli Malaysia dengan lapisan buih tebal, dibancuh sempurna untuk rasa lemak berkrim.',
    priceEn: 'From RM 3',
    priceBm: 'Daripada RM 3',
    image: `/assets/teh-tarik.jpg`,
  },
];

export default function MenuSection() {
  const { language, t } = useLanguage();

  const headerRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    childSelector: '.menu-header',
    stagger: 0.1,
  });

  const gridRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    y: 40,
    childSelector: '.menu-card',
    stagger: 0.12,
    delay: 0.3,
  });

  return (
    <section id="menu" className="section-padding bg-deep-forest">
      <div className="content-container">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="menu-header flex justify-center">
            <SectionLabel text={t('our_menu')} light />
          </div>
          <h2 className="menu-header font-display font-semibold text-[40px] md:text-[64px] text-cream leading-[1.05] mb-6">
            {t('signature_dishes')}
          </h2>
          <p className="menu-header font-body font-light text-lg text-cream/50 leading-relaxed max-w-[600px] mx-auto">
            {t('menu_subtitle')}
          </p>
        </div>

        {/* Featured Item - Large */}
        <div className="mb-8">
          <div className="menu-card">
            <div className="group relative bg-forest-green rounded-2xl overflow-hidden border border-cream/5 hover:border-moss/20 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative min-h-[300px]">
                  <img
                    src="/assets/asam-pedas.jpg"
                    alt="Featured Asam Pedas"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-forest-green/80 via-transparent to-transparent" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-moss/30 to-transparent lg:hidden" />
                  
                  <span className="inline-block w-fit px-3 py-1 bg-honey/10 border border-honey/20 text-honey rounded-full text-[10px] uppercase tracking-wider font-medium mb-4">
                    Chef's Recommendation
                  </span>
                  <h3 className="font-display font-semibold text-3xl text-cream mb-4">
                    Asam Pedas
                  </h3>
                  <p className="font-body text-cream/60 leading-relaxed mb-6 font-light">
                    Our #1 crowd favorite — spicy tamarind fish stew with tangy, bold flavors. A true Malay classic that has been perfected over four decades.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-['Montserrat',sans-serif] font-medium text-honey text-lg">From RM 8</span>
                    <div className="h-4 w-[1px] bg-cream/20" />
                    <span className="text-cream/40 text-sm">Best Seller</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_ITEMS.slice(1).map((item) => (
            <div key={item.nameEn} className="menu-card">
              <FoodCard
                name={language === 'en' ? item.nameEn : item.nameBm}
                description={language === 'en' ? item.descEn : item.descBm}
                price={language === 'en' ? item.priceEn : item.priceBm}
                image={item.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
