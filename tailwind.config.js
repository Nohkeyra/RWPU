/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---------- Brand "Wawasan Pak Usop" palette ----------
        // Reworked to match the restaurant's real-world cues:
        // dark kopi surfaces, brass-gold accents, sambal terracotta,
        // and warm cream paper inspired by menu cards and invoices.
        'deep-forest':   '#17110F', // kopi black / main background
        'forest-green':  '#241A16', // espresso brown surface
        'light-forest':  '#33231D', // raised wood-tone surface
        'moss':          '#6E3E1E', // roasted spice brown
        'fern':          '#8C5230', // copper hover accent
        'sage':          '#D8B16A', // soft brass highlight
        // Warm heritage accents.
        'kiwi':          '#B85C38', // terracotta clay accent
        'sunshine':      '#D4A853', // signature heritage gold
        'honey':         '#E2BD74', // bright brass gold
        'crisp-carrot':  '#C1673C', // sambal orange
        'tomato-burst':  '#A84424', // chili red / destructive
        'burnt-orange':  '#9D4B2B', // warm earth red
        'walnut':        '#5B4030', // wood tone
        'cream':         '#F6EFE2', // warm paper / text on dark
        'stone':         '#CABBA7', // muted text on dark
        // Convenience aliases (old name -> brand color).
        'amber':         '#D4A853', // alias of sunshine
        // Backward-compatible aliases — older components (AdminPanel.tsx,
        // OrderForm.tsx, AdminPage.tsx) still reference these class names.
        // Mapped to the closest equivalent in the new nature palette so
        // those 58+ existing references keep working without editing every
        // file. Semantically: charcoal/deep-brown -> deep-forest (main dark
        // background), warm-gold -> sage (accent/highlight color).
        'charcoal':      '#17110F',
        'deep-brown':    '#241A16',
        'warm-gold':     '#D4A853',
        // ---------- shadcn tokens (HSL) ----------
        border:          "hsl(var(--border))",
        input:           "hsl(var(--input))",
        ring:            "hsl(var(--ring))",
        background:      "hsl(var(--background))",
        foreground:      "hsl(var(--foreground))",
        primary: {
          DEFAULT:       "hsl(var(--primary))",
          foreground:    "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:       "hsl(var(--secondary))",
          foreground:    "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:       "hsl(var(--destructive) / <alpha-value>)",
          foreground:    "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:       "hsl(var(--muted))",
          foreground:    "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:       "hsl(var(--accent))",
          foreground:    "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:       "hsl(var(--popover))",
          foreground:    "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:       "hsl(var(--card))",
          foreground:    "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        accent:  ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        // Brand-tinted glow shadows.
        'moss-glow':    '0 8px 30px rgba(110, 62, 30, 0.35)',
        'kiwi-glow':    '0 0 20px rgba(184, 92, 56, 0.35)',
        'sunshine-glow':'0 8px 30px rgba(212, 168, 83, 0.35)',
        'carrot-glow':  '0 8px 30px rgba(193, 103, 60, 0.35)',
        'tomato-glow':  '0 0 20px rgba(168, 68, 36, 0.3)',
      },
      keyframes: {
        "bounce-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(45, 106, 63, 0.25)" },
          "50%":      { boxShadow: "0 0 30px rgba(45, 106, 63, 0.45)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "honey-drip": {
          "0%":   { transform: "scaleY(0)", transformOrigin: "top" },
          "50%":  { transform: "scaleY(1)", transformOrigin: "top" },
          "100%": { transform: "scaleY(1)", transformOrigin: "bottom" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "leaf-sway": {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%":      { transform: "rotate(5deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        "success-pop": {
          "0%":   { transform: "scale(0.8)", opacity: "0" },
          "50%":  { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%":      { transform: "translateX(-4px)" },
          "75%":      { transform: "translateX(4px)" },
        },
        "kiwi-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(154, 188, 4, 0.6)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(154, 188, 4, 0)" },
        },
        "sunshine-pulse": {
          "0%, 100%": { transform: "scale(1)",    filter: "brightness(1)" },
          "50%":      { transform: "scale(1.015)", filter: "brightness(1.04)" },
        },
      },
      animation: {
        "bounce-down":     "bounce-down 1.5s ease-in-out infinite",
        "glow-pulse":      "glow-pulse 3s ease-in-out infinite",
        "shimmer":         "shimmer 2s linear infinite",
        "honey-drip":      "honey-drip 0.4s ease-out forwards",
        "float":           "float 3s ease-in-out infinite",
        "leaf-sway":       "leaf-sway 2s ease-in-out infinite",
        "gradient-shift":  "gradient-shift 3s ease infinite",
        "success-pop":     "success-pop 0.5s ease-out",
        "shake":           "shake 0.3s ease-in-out",
        "kiwi-pulse":      "kiwi-pulse 2s ease-in-out infinite",
        "sunshine-pulse":  "sunshine-pulse 4.5s ease-in-out infinite",
      },
      backgroundImage: {
        // Brand signature gradients (referenced in components + index.css).
        'brand-gradient':         'linear-gradient(90deg, #241A16 0%, #6E3E1E 35%, #D4A853 72%, #C1673C 100%)',
        'brand-gradient-soft':    'linear-gradient(90deg, #33231D 0%, #6E3E1E 40%, #D8B16A 75%, #E2BD74 100%)',
        'brand-cta':              'linear-gradient(90deg, #33231D 0%, #8C5230 35%, #D4A853 72%, #C1673C 100%)',
        'sunshine-shine':         'linear-gradient(135deg, #D4A853 0%, #E2BD74 50%, #C1673C 100%)',
        'forest-depth':           'linear-gradient(180deg, #17110F 0%, #241A16 50%, #33231D 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
