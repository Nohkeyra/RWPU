import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-cream/15 placeholder:text-stone/60 selection:bg-kiwi/30 selection:text-cream",
        "bg-light-forest/40 text-cream",
        "flex field-sizing-content min-h-20 w-full rounded-lg border px-4 py-3 text-sm",
        "shadow-sm transition-all duration-300 outline-none",
        "focus-visible:border-moss/40 focus-visible:bg-forest-green focus-visible:shadow-[0_0_0_3px_rgba(45,106,63,0.15)]",
        "aria-invalid:border-tomato-burst aria-invalid:shadow-[0_0_0_3px_rgba(212,37,24,0.15)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
