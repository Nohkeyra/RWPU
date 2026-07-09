interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <div className="group relative bg-forest-green rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-forest-green/20 to-transparent opacity-90" />
        
        {/* Price Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-moss/90 backdrop-blur-sm text-cream px-3 py-1.5 rounded-lg border border-cream/10">
          <span className="font-['Montserrat',sans-serif] font-medium text-[11px] tracking-wider">
            {price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Decorative Line */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-moss/30 to-transparent" />
        
        <h3 className="font-display font-semibold text-xl text-cream tracking-tight mt-2 group-hover:text-moss transition-colors duration-300">
          {name}
        </h3>
        
        <p className="font-body font-light text-[13px] text-cream/60 leading-relaxed mt-3 flex-grow line-clamp-3">
          {description}
        </p>
        
        {/* Bottom Action */}
        <div className="mt-5 pt-4 border-t border-cream/5 flex items-center justify-between">
          <span className="font-['Montserrat',sans-serif] text-[9px] uppercase tracking-[0.2em] text-moss/70 font-medium">
            Signature Dish
          </span>
          <div className="w-8 h-8 rounded-full bg-moss/10 flex items-center justify-center group-hover:bg-moss/20 transition-colors">
            <svg className="w-4 h-4 text-moss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
