interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <div className="group relative bg-forest-green rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/[0.06] hover:border-sunshine/25 kp-lift">
      <div className="relative aspect-[4/3] overflow-hidden kp-zoom">
        <img
          src={image}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-forest-green/25 to-transparent opacity-95 group-hover:opacity-75 transition-opacity duration-500" />

        <div className="absolute top-4 right-4 bg-sunshine text-deep-forest px-4 py-2 rounded-full shadow-sunshine-glow transition-all">
          <span className="font-accent font-semibold text-[11px] tracking-wider kp-price">
            {price}
          </span>
        </div>
      </div>

      <div className="p-6 relative paper-texture">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-sunshine/35 to-transparent transition-all duration-500" />

        <div className="inline-flex items-center gap-2 rounded-full border border-sunshine/15 bg-sunshine/8 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-sunshine mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-sunshine" />
          Signature Dish
        </div>

        <h3 className="font-display font-semibold text-[24px] text-cream tracking-tight group-hover:text-sunshine transition-colors duration-300">
          {name}
        </h3>

        <p className="font-body font-light text-[13px] text-cream/56 leading-relaxed mt-3 line-clamp-3 group-hover:text-cream/72 transition-colors">
          {description}
        </p>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-accent text-[9px] uppercase tracking-[0.22em] text-stone font-medium">
            Restoran Wawasan
          </span>
          <div className="w-9 h-9 rounded-full bg-sunshine/10 border border-sunshine/20 flex items-center justify-center group-hover:bg-sunshine group-hover:border-sunshine group-hover:shadow-sunshine-glow group-hover:rotate-45 transition-all duration-300">
            <svg className="w-4 h-4 text-sunshine group-hover:text-deep-forest transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
