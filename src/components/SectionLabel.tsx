interface SectionLabelProps {
  text: string;
  light?: boolean;
}

export default function SectionLabel({ text, light = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse" />
        <span className="w-8 h-[1px] bg-gradient-to-r from-moss to-transparent" />
      </div>
      <span
        className={`font-body font-medium text-[10px] uppercase tracking-[0.2em] ${
          light ? 'text-moss' : 'text-moss'
        }`}
      >
        {text}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="w-8 h-[1px] bg-gradient-to-l from-moss to-transparent" />
        <span className="w-1.5 h-1.5 rounded-full bg-moss/50" />
      </div>
    </div>
  );
}
