import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-6 h-6", className)}>
      <div className="absolute inset-0 border-2 border-moss/20 rounded-full" />
      <div className="absolute inset-0 border-2 border-t-moss border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
    </div>
  );
}
