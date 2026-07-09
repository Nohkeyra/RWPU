import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-cream placeholder:text-stone/50 selection:bg-moss/30 selection:text-cream",
        "bg-deep-forest/70 border-cream/15 text-cream focus:border-moss/50 focus:ring-2 focus:ring-moss/20",
        "h-11 w-full min-w-0 rounded-lg border px-4 py-2 text-sm",
        "shadow-sm transition-all duration-300",
        "outline-none",
        "focus-visible:border-moss/40 focus-visible:bg-forest-green focus-visible:shadow-[0_0_0_3px_rgba(74,124,89,0.15)]",
        "aria-invalid:border-burnt-orange aria-invalid:shadow-[0_0_0_3px_rgba(184,92,56,0.1)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
