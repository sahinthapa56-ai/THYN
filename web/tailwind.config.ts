import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thyn: {
          bg: "#0A0A0A",
          surface: "#111111",
          surface2: "#1A1A1A",
          border: "rgba(255,255,255,0.08)",
          border2: "rgba(255,255,255,0.15)",
          text: "#FFFFFF",
          muted: "#A1A1AA",
          primary: "#6D5DFC",
          secondary: "#8B7FFF",
          accent: "#A78BFA",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
        display: ["Syne", "sans-serif"],
      },
      borderRadius: {
        glass: "24px",
        xl2: "20px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.5)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.3)",
        glow: "0 0 40px rgba(109,93,252,0.15)",
        "glow-sm": "0 0 20px rgba(109,93,252,0.1)",
      },
      backdropBlur: {
        glass: "32px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        pulse: "pulse 3s ease-in-out infinite",
        "gradient-x": "gradientX 4s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
