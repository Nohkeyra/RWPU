import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import ReviewCard from '@/components/ReviewCard';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useCarousel } from '@/hooks/useCarousel';
import { useLanguage } from '@/context/LanguageContext';

const REVIEWS = [
  {
    text: "Wah... we are on our last day of our Putrajaya holiday. The place is at the basement of an administration building with a great view of lake and the mosque. My wife and I bought nasi goreng kampung, nasi lemak, and some other varieties. Everything was good. Really good food, and definitely affordable.",
    name: 'Sufian A',
    rating: 5,
  },
  {
    text: "The food was delicious and the owners are great people. After we ate our lunch here, they give us to try typical Malaysian delicious dessert — fried bananas and durian soup.",
    name: 'Anastasia V',
    rating: 5,
  },
  {
    text: "The Lontong Singapore, Soto and nasi campur are exquisitely delicious! My favorite is the Asam Pedas and ikan keli sambal. Also the teh tarik is legendary, and the coffee here uses Muar's 434 which is well known. Recommended!",
    name: 'Irwan R',
    rating: 5,
  },
  {
    text: "Soto Ayam was delicious. The price is really good for the area where it is located. A hidden gem in Putrajaya with authentic flavors.",
    name: 'Carolina P',
    rating: 5,
  },
  {
    text: "Pelbagai juadah yang tersedia — makanan ala padang yang bermacam-macam lauk dan pauk. Asam pedas, nasi lemak, mee rebus, mee soto, rendang padang, rojak Singapore. Semuanya sedap!",
    name: 'Regular Customer',
    rating: 5,
  },
];

export default function ReviewsSection() {
  const { t } = useLanguage();
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const headerRef = useScrollTrigger<HTMLDivElement>({
    animation: 'fade-up',
    childSelector: '.review-header',
    stagger: 0.1,
  });

  const {
    currentIndex,
    goTo,
    goNext,
    goPrev,
    setIsHovered,
    containerRef,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useCarousel({
    totalSlides: REVIEWS.length,
    slidesToShow,
    autoPlayInterval: 6000,
  });

  return (
    <section id="reviews" className="section-padding bg-deep-forest">
      <div className="content-container">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="text-center md:text-left">
            <div className="review-header flex justify-center md:justify-start">
              <SectionLabel text={t('testimonials')} light />
            </div>
            <h2 className="review-header font-display font-semibold text-[36px] md:text-[48px] text-cream leading-[1.1]">
              {t('guest_reviews')}
            </h2>
          </div>
          
          <div className="review-header flex items-center justify-center gap-4 mt-6 md:mt-0">
            <div className="flex items-center gap-2 bg-forest-green border border-cream/5 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-honey fill-honey" />
              <span className="font-medium text-cream text-sm">4.9</span>
              <span className="text-cream/40 text-xs">/ 5</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full bg-forest-green border border-cream/5 flex items-center justify-center hover:bg-moss transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-cream" />
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full bg-forest-green border border-cream/5 flex items-center justify-center hover:bg-moss transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-cream" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              }}
            >
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: Math.max(1, REVIEWS.length - slidesToShow + 1) }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? 'w-8 bg-moss'
                    : 'w-1.5 bg-cream/20 hover:bg-cream/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
