/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-forest': '#0F1F17',
        'forest-green': '#1A3A2E',
        'light-forest': '#2A4A3E',
        'moss': '#4A7C59',
        'fern': '#6B8E5A',
        'sage': '#87A878',
        'honey': '#D4A03D',
        'amber': '#E07B39',
        'burnt-orange': '#B85C38',
        'walnut': '#5C4033',
        'cream': '#F5F0E8',
        'stone': '#C4B8A8',
        // Backward-compatible aliases — older components (AdminPanel.tsx,
        // OrderForm.tsx, AdminPage.tsx) still reference these class names.
        // Mapped to the closest equivalent in the new nature palette so
        // those 58+ existing references keep working without editing every
        // file. Semantically: charcoal/deep-brown -> deep-forest (main dark
        // background), warm-gold -> sage (accent/highlight color).
        'charcoal': '#0F1F17',
        'deep-brown': '#0F1F17',
        'warm-gold': '#87A878',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      keyframes: {
        "bounce-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(74, 124, 89, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(74, 124, 89, 0.4)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "honey-drip": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "100%": { transform: "scaleY(1)", transformOrigin: "bottom" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "leaf-sway": {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "bounce-down": "bounce-down 1.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "honey-drip": "honey-drip 0.4s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "leaf-sway": "leaf-sway 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
