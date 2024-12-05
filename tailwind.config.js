/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "570px",
      md: "768px",
      lg: "768px",
      xl: "1280px",
      "2xl": "1280px",
    },
    container: {
      center: true,
    },
    extend: {
      transitionProperty: {
        transform: "transform",
        opacity: "opacity",
      },

      backgroundImage: {
        bg: "url('/bg.png')",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "p-gray": "#7A7A7A",
        buttonColor: "#F25F3E",
      },
      fontFamily: {
        "sf-pro-display-normal": ["SFProDisplayNormal", "sans-serif"],
        "sf-pro-display-medium": ["SFProDisplayMedium", "sans-serif"],
        "sf-pro-display-bold": ["SFProDisplayBold", "sans-serif"],
        galantic: ["Galantic-OGZXP", "sans-serif"],
      },
      boxShadow: {
        "button-shadow": "0px 2.17px 5.79px 0px #0000003D",
        "header-shadow": "0px 2.4px 12px 0px #0000001A",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
