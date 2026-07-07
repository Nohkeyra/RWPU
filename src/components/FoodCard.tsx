interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function FoodCard({ name, description, price, image }: FoodCardProps) {
  return (
    <div className="group bg-deep-brown border-[0.5px] border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] flex flex-col h-full relative">
      {/* Visual top bar decorator */}
      <div className="h-1 w-full bg-gradient-to-r from-terracotta via-warm-gold to-terracotta" />
      
      {/* Image container with modern hover zoom and gradient shield */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={image}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        {/* Soft elegant shadow overlay inside image */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/90 to-transparent opacity-70" />
      </div>

      {/* Content wrapper */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-display font-medium text-[22px] text-cream tracking-tight group-hover:text-warm-gold transition-colors duration-300">
            {name}
          </h3>
        </div>
        
        <p className="font-body font-light text-[14px] text-cream/70 leading-relaxed mt-4 flex-grow">
          {description}
        </p>
        
        {/* Price Tag with background badge styling */}
        <div className="mt-6 pt-5 border-t-[0.5px] border-cream/10 flex justify-between items-center">
          <span className="font-['Montserrat',sans-serif] text-[10px] uppercase tracking-[0.2em] text-cream/40 font-medium">Signature</span>
          <span className="font-['Montserrat',sans-serif] font-light text-[0.95rem] tracking-wider text-warm-gold px-3 py-1.5 border-[0.5px] border-warm-gold/20 shadow-sm">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
