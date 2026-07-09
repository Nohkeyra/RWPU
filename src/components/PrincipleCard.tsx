import type { LucideIcon } from 'lucide-react';

interface PrincipleCardProps {
  icon: LucideIcon;
  name: string;
  malayName: string;
  description: string;
}

export default function PrincipleCard({ icon: Icon, name, malayName, description }: PrincipleCardProps) {
  return (
    <div className="group relative bg-deep-forest/60 rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-forest-green/80 hover:shadow-[0_12px_40px_-8px_rgba(74,124,89,0.2)] flex flex-col items-center h-full border border-cream/5 hover:border-moss/20">
      {/* Icon with Glow Effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-moss/20 rounded-full blur-xl group-hover:bg-moss/30 transition-all duration-500" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-moss/20 to-moss/5 border border-moss/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-7 h-7 text-moss" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Malay Name Badge */}
      <span className="inline-block px-3 py-1 bg-moss/10 rounded-full font-['Montserrat',sans-serif] font-medium text-[9px] text-moss uppercase tracking-[0.15em] mb-3">
        {malayName}
      </span>
      
      <h3 className="font-display font-semibold text-lg text-cream mb-3">
        {name}
      </h3>
      
      <p className="font-body text-[13px] text-cream/60 leading-relaxed flex-grow">
        {description}
      </p>
      
      {/* Bottom Accent Line */}
      <div className="mt-6 w-12 h-[2px] bg-gradient-to-r from-transparent via-moss/50 to-transparent group-hover:w-20 transition-all duration-500" />
    </div>
  );
}
