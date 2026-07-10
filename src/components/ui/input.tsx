import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-cream placeholder:text-stone/60 selection:bg-kiwi/30 selection:text-cream",
        "bg-light-forest/40 border-cream/15 text-cream",
        "h-11 w-full min-w-0 rounded-lg border px-4 py-2 text-sm",
        "shadow-sm transition-all duration-300",
        "outline-none",
        "focus-visible:border-moss/40 focus-visible:bg-forest-green focus-visible:shadow-[0_0_0_3px_rgba(45,106,63,0.15)]",
        "aria-invalid:border-tomato-burst aria-invalid:shadow-[0_0_0_3px_rgba(212,37,24,0.1)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "touch-target",
        className
      )}
      {...props}
    />
  )
}

export { Input }
