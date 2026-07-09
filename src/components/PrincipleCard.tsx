import type { LucideIcon } from 'lucide-react';

interface PrincipleCardProps {
  icon: LucideIcon;
  name: string;
  malayName: string;
  description: string;
}

export default function PrincipleCard({ icon: Icon, name, malayName, description }: PrincipleCardProps) {
  return (
    <div className="group relative bg-deep-forest/60 rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-forest-green/80 hover:shadow-[0_12px_40px_-8px_rgba(74,124,89,0.25)] flex flex-col items-center h-full border border-cream/5 hover:border-moss/30">
      {/* Animated glow behind icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-moss/20 rounded-full blur-xl group-hover:bg-moss/40 group-hover:scale-150 transition-all duration-700" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-moss/20 to-moss/5 border border-moss/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-7 h-7 text-moss group-hover:text-sage transition-colors" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Malay Name Badge with shimmer */}
      <span className="inline-block px-4 py-1.5 bg-moss/10 rounded-full font-['Montserrat',sans-serif] font-medium text-[9px] text-moss uppercase tracking-[0.15em] mb-3 group-hover:bg-moss/20 transition-colors">
        {malayName}
      </span>
      
      <h3 className="font-display font-semibold text-lg text-cream mb-3 group-hover:text-moss transition-colors">
        {name}
      </h3>
      
      <p className="font-body text-[13px] text-cream/50 leading-relaxed flex-grow group-hover:text-cream/70 transition-colors">
        {description}
      </p>
      
      {/* Animated bottom accent */}
      <div className="mt-6 w-12 h-[2px] bg-gradient-to-r from-transparent via-moss/40 to-transparent group-hover:w-24 group-hover:via-moss/70 transition-all duration-500" />
    </div>
  );
}
