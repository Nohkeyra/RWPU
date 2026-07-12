import { Leaf, FileText, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: "leaf" | "file" | "inbox";
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon = "leaf", 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  const icons = {
    leaf: Leaf,
    file: FileText,
    inbox: Inbox
  };

  const Icon = icons[icon];

  return (
    <div className={cn("text-center py-16 px-6", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kiwi/10 border border-kiwi/20 flex items-center justify-center">
        <Icon className="w-8 h-8 text-kiwi/70" />
      </div>
      <h3 className="font-display text-xl text-deep-forest mb-2">{title}</h3>
      <p className="text-stone text-sm max-w-xs mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
