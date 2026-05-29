import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sumi: "#1C1C1C",
        vermilion: "#D13434",
        kinari: "#F7F5F0",
        gold: "#D4AF37",
        "sumi-light": "#2E2E2E",
        "kinari-dark": "#E8E4DC",
      },
      fontFamily: {
        mincho: ["var(--font-noto-serif-jp)", "Yu Mincho", "serif"],
      },
      animation: {
        "scan-line": "scanLine 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { transform: "translateY(0%)", opacity: "0.8" },
          "50%": { transform: "translateY(100%)", opacity: "0.4" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
