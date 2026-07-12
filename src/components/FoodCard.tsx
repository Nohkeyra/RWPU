import { getAssetUrl } from "@/lib/utils";

interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  isBestseller?: boolean;
  isSpicy?: boolean;
}

export default function FoodCard({ name, description, price, image, isBestseller, isSpicy }: FoodCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(25,83,43,0.15)] border border-deep-forest/5 hover:border-sunshine/50 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getAssetUrl(image)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isBestseller && (
            <span className="bg-tomato-burst text-deep-forest px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              BESTSELLER
            </span>
          )}
          {isSpicy && (
            <span className="bg-crisp-carrot text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🔥 SPICY
            </span>
          )}
        </div>
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-sunshine text-deep-forest px-4 py-2 rounded-full font-bold shadow-sunshine-glow">
          {price}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-cream/30">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display font-semibold text-xl text-deep-forest group-hover:text-crisp-carrot transition-colors">
            {name}
          </h3>
        </div>
        <p className="font-body text-sm text-stone leading-relaxed flex-1">
          {description}
        </p>
        
        <div className="mt-5 pt-4 border-t border-deep-forest/10 flex items-center justify-between">
          <span className="font-accent text-xs uppercase tracking-wider text-deep-forest/60">
            Restoran Wawasan
          </span>
          <button className="w-10 h-10 rounded-full bg-deep-forest/5 border border-deep-forest/10 flex items-center justify-center group-hover:bg-sunshine group-hover:border-sunshine group-hover:shadow-sunshine-glow transition-all duration-300">
            <svg className="w-5 h-5 text-deep-forest group-hover:text-deep-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
