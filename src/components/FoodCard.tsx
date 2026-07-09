interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <div className="group relative bg-forest-green rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient Overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-forest-green/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
        
        {/* Floating price badge with glow */}
        <div className="absolute top-4 right-4 bg-moss/90 backdrop-blur-sm text-cream px-4 py-2 rounded-xl shadow-lg group-hover:bg-moss transition-colors">
          <span className="font-['Montserrat',sans-serif] font-medium text-[11px] tracking-wider">
            {price}
          </span>
        </div>

        {/* Quick action on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-cream/20 backdrop-blur-sm flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative paper-texture">
        {/* Decorative Line with animation */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-moss/30 to-transparent group-hover:via-moss/60 transition-all duration-500" />
        
        <h3 className="font-display font-semibold text-xl text-cream tracking-tight group-hover:text-moss transition-colors duration-300">
          {name}
        </h3>
        
        <p className="font-body font-light text-[13px] text-cream/50 leading-relaxed mt-3 line-clamp-2 group-hover:text-cream/70 transition-colors">
          {description}
        </p>
        
        {/* Bottom Action */}
        <div className="mt-5 pt-4 border-t border-cream/5 flex items-center justify-between">
          <span className="font-['Montserrat',sans-serif] text-[9px] uppercase tracking-[0.2em] text-moss/70 font-medium">
            Signature Dish
          </span>
          <div className="w-8 h-8 rounded-full bg-moss/10 flex items-center justify-center group-hover:bg-moss/30 group-hover:rotate-45 transition-all duration-300">
            <svg className="w-4 h-4 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
