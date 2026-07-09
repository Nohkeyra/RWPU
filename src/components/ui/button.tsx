/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-moss/50 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-forest",
  {
    variants: {
      variant: {
        default: "bg-moss text-cream hover:bg-fern hover:shadow-[0_0_20px_rgba(74,124,89,0.3)]",
        destructive:
          "bg-burnt-orange text-cream hover:bg-burnt-orange/90 shadow-[0_0_15px_rgba(184,92,56,0.2)]",
        outline:
          "border border-cream/15 bg-transparent text-cream hover:bg-cream/5 hover:border-moss/30",
        secondary:
          "bg-forest-green text-cream border border-cream/10 hover:bg-light-forest hover:border-cream/15",
        ghost:
          "text-stone hover:text-cream hover:bg-cream/5",
        link: "text-moss underline-offset-4 hover:underline hover:text-sage",
      },
      size: {
        default: "h-10 px-5 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
