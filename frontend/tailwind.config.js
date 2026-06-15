/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B9D",
          50: "#FFF5F8",
          100: "#FFE5ED",
          200: "#FFCCD9",
          300: "#FFB3C6",
          400: "#FF8FAB",
          500: "#FF6B9D",
          600: "#FF478E",
          700: "#FF237F",
          800: "#E6006B",
          900: "#B30052",
        },
        secondary: {
          DEFAULT: "#FF8FAB",
          50: "#FFF7F9",
          100: "#FFECF1",
          200: "#FFD9E4",
          300: "#FFC6D6",
          400: "#FFB3C9",
          500: "#FF8FAB",
          600: "#FF6B9D",
          700: "#FF478E",
          800: "#FF237F",
          900: "#E6006B",
        },
        accent: "#FFB3C6",
        "dark-bg": "#1A1A2E",
        "dark-card": "#16213E",
        "dark-border": "#0F3460",
        "dark-text": "#E8E8F0",
      },
      backgroundImage: {
        "gradient-ice":
          "linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 50%, #FFB3C6 100%)",
        "gradient-warm":
          "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
        "gradient-cool":
          "linear-gradient(135deg, #6B9DFF 0%, #8FABFF 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        ice: "0 4px 14px 0 rgba(255, 107, 157, 0.25)",
        "ice-lg": "0 8px 24px 0 rgba(255, 107, 157, 0.35)",
        "ice-xl": "0 12px 36px 0 rgba(255, 107, 157, 0.45)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        bounce: "bounce 1s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
