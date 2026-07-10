import type { LucideIcon } from 'lucide-react';

interface PrincipleCardProps {
  icon: LucideIcon;
  name: string;
  malayName: string;
  description: string;
}

export default function PrincipleCard({ icon: Icon, name, malayName, description }: PrincipleCardProps) {
  return (
    <div className="group relative bg-deep-forest/60 rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-forest-green/80 hover:shadow-[0_12px_40px_-8px_rgba(45,106,63,0.35)] flex flex-col items-center h-full border border-cream/5 hover:border-kiwi/40">
      {/* Animated glow behind icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-kiwi/20 rounded-full blur-xl group-hover:bg-kiwi/40 group-hover:scale-150 transition-all duration-700" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-kiwi/20 to-kiwi/5 border border-kiwi/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:border-kiwi/60 transition-all duration-500">
          <Icon className="w-7 h-7 text-kiwi group-hover:text-sunshine transition-colors duration-300" strokeWidth={1.5} />
        </div>
      </div>

      {/* Malay Name Badge with shimmer */}
      <span className="inline-block px-4 py-1.5 bg-kiwi/10 border border-kiwi/20 rounded-full font-accent font-semibold text-[9px] text-kiwi uppercase tracking-[0.15em] mb-3 group-hover:bg-kiwi/20 group-hover:border-kiwi/40 transition-colors">
        {malayName}
      </span>

      <h3 className="font-display font-semibold text-lg text-cream mb-3 group-hover:text-kiwi transition-colors duration-300">
        {name}
      </h3>

      <p className="font-body text-[13px] text-cream/50 leading-relaxed flex-grow group-hover:text-cream/70 transition-colors">
        {description}
      </p>

      {/* Animated bottom accent — brand gradient */}
      <div className="mt-6 w-12 h-[2px] bg-gradient-to-r from-transparent via-kiwi/50 to-transparent group-hover:w-24 group-hover:via-sunshine/80 transition-all duration-500" />
    </div>
  );
}
