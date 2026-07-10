import { Star, Quote } from 'lucide-react';

interface ReviewCardProps {
  text: string;
  name: string;
  rating: number;
}

export default function ReviewCard({ text, name, rating }: ReviewCardProps) {
  return (
    <div className="group relative bg-forest-green rounded-2xl p-8 min-h-[320px] flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] border border-cream/5 hover:border-sunshine/30">
      {/* Top accent with animation — sunshine gradient */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-sunshine/40 to-transparent group-hover:via-sunshine/80 transition-all duration-500" />

      {/* Quote icon with float animation */}
      <div className="mb-5 group-hover:animate-float">
        <Quote className="w-8 h-8 text-sunshine/30 group-hover:text-sunshine/60 transition-colors" strokeWidth={1.5} />
      </div>

      {/* Stars with staggered hover — sunshine fill */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              i < rating ? 'text-sunshine fill-sunshine drop-shadow-[0_0_4px_rgba(255,202,38,0.5)]' : 'text-cream/10'
            } group-hover:scale-110`}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="font-body font-light text-[15px] text-cream/70 leading-[1.7] italic flex-1 group-hover:text-cream/90 transition-colors">
        "{text}"
      </p>

      {/* Author with hover reveal */}
      <div className="mt-6 pt-5 border-t border-cream/5 flex items-center justify-between">
        <div>
          <p className="font-display font-medium text-[15px] text-cream group-hover:text-kiwi transition-colors">{name}</p>
          <span className="font-accent text-[10px] text-stone uppercase tracking-wider">
            Verified Guest
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-sunshine/15 border border-sunshine/30 flex items-center justify-center group-hover:bg-sunshine group-hover:border-sunshine group-hover:shadow-sunshine-glow group-hover:scale-110 transition-all">
          <span className="font-display text-sm text-sunshine group-hover:text-deep-forest transition-colors">{name.charAt(0)}</span>
        </div>
      </div>
    </div>
  );
}
