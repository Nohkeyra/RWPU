interface SectionLabelProps {
  text: string;
  light?: boolean;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-kiwi animate-pulse" />
        <span className="w-8 h-[1px] bg-gradient-to-r from-kiwi via-moss to-transparent" />
      </div>
      <span
        className={`font-accent font-semibold text-[10px] uppercase tracking-[0.2em] text-kiwi`}
      >
        {text}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="w-8 h-[1px] bg-gradient-to-l from-kiwi via-moss to-transparent" />
        <span className="w-1.5 h-1.5 rounded-full bg-kiwi/50" />
      </div>
    </div>
  );
}
