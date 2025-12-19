/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--border) / ${opacityValue})` : `oklch(var(--border))`,
        input: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--input) / ${opacityValue})` : `oklch(var(--input))`,
        ring: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--ring) / ${opacityValue})` : `oklch(var(--ring))`,
        background: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--background) / ${opacityValue})` : `oklch(var(--background))`,
        foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--foreground) / ${opacityValue})` : `oklch(var(--foreground))`,
        primary: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--primary) / ${opacityValue})` : `oklch(var(--primary))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--primary-foreground) / ${opacityValue})` : `oklch(var(--primary-foreground))`,
        },
        secondary: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--secondary) / ${opacityValue})` : `oklch(var(--secondary))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--secondary-foreground) / ${opacityValue})` : `oklch(var(--secondary-foreground))`,
        },
        destructive: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--destructive) / ${opacityValue})` : `oklch(var(--destructive))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--destructive-foreground) / ${opacityValue})` : `oklch(var(--destructive-foreground))`,
        },
        muted: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--muted) / ${opacityValue})` : `oklch(var(--muted))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--muted-foreground) / ${opacityValue})` : `oklch(var(--muted-foreground))`,
        },
        accent: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--accent) / ${opacityValue})` : `oklch(var(--accent))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--accent-foreground) / ${opacityValue})` : `oklch(var(--accent-foreground))`,
        },
        popover: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--popover) / ${opacityValue})` : `oklch(var(--popover))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--popover-foreground) / ${opacityValue})` : `oklch(var(--popover-foreground))`,
        },
        card: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--card) / ${opacityValue})` : `oklch(var(--card))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--card-foreground) / ${opacityValue})` : `oklch(var(--card-foreground))`,
        },
        sidebar: {
          DEFAULT: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar) / ${opacityValue})` : `oklch(var(--sidebar))`,
          foreground: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-foreground) / ${opacityValue})` : `oklch(var(--sidebar-foreground))`,
          primary: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-primary) / ${opacityValue})` : `oklch(var(--sidebar-primary))`,
          "primary-foreground": ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-primary-foreground) / ${opacityValue})` : `oklch(var(--sidebar-primary-foreground))`,
          accent: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-accent) / ${opacityValue})` : `oklch(var(--sidebar-accent))`,
          "accent-foreground": ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-accent-foreground) / ${opacityValue})` : `oklch(var(--sidebar-accent-foreground))`,
          border: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-border) / ${opacityValue})` : `oklch(var(--sidebar-border))`,
          ring: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--sidebar-ring) / ${opacityValue})` : `oklch(var(--sidebar-ring))`,
        },
        chart: {
          1: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--chart-1) / ${opacityValue})` : `oklch(var(--chart-1))`,
          2: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--chart-2) / ${opacityValue})` : `oklch(var(--chart-2))`,
          3: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--chart-3) / ${opacityValue})` : `oklch(var(--chart-3))`,
          4: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--chart-4) / ${opacityValue})` : `oklch(var(--chart-4))`,
          5: ({ opacityValue }) => opacityValue !== undefined ? `oklch(var(--chart-5) / ${opacityValue})` : `oklch(var(--chart-5))`,
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        serif: ["var(--font-serif)", "Source Serif 4", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}