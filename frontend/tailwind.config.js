/** @type {import('tailwindcss').Config} */
module.exports = {
  blocklist: ["overline"],
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        z: {
          bg: "#02040A",
          navy: "#070B14",
          surface: "#0D1322",
          cyan: "#00E5FF",
          blue: "#1E90FF",
          sky: "#5EA8FF",
          lilac: "#B98CFF",
          purple: "#8A2BE2",
          gold: "#FFB800",
          ink: "#FFFFFF",
          body: "#CBD5E1",
          muted: "#94A3B8",
          eyebrow: "#67E8F9",
          live: "#34D399",
        },
      },
      fontFamily: {
        display: ['"Unbounded Variable"', "Unbounded", "system-ui", "sans-serif"],
        sans: ['"Outfit Variable"', "Outfit", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { ctl: "12px", card: "16px" },
      transitionTimingFunction: { signal: "cubic-bezier(.2,.8,.2,1)" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
