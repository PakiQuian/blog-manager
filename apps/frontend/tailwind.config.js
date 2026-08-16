import { heroui } from "@heroui/theme";

const primary = {
  50: "#F5F7E8",
  100: "#E8EBD0",
  200: "#D5D9AC",
  300: "#BCC17C",
  400: "#95992A",
  500: "#6C6F00",
  600: "#585B00",
  700: "#454700",
  800: "#323400",
  900: "#202200",
  DEFAULT: "#6C6F00",
  foreground: "#FFFFFF",
};

const accent = {
  50: "#FFF2E9",
  100: "#FFE4D4",
  200: "#FECBAF",
  300: "#F2AB83",
  400: "#E4864E",
  500: "#CB6620",
  600: "#AE4F00",
  700: "#893B00",
  800: "#652900",
  900: "#451B00",
  DEFAULT: "#CB6620",
  foreground: "#FFFFFF",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary,
            secondary: accent,
            focus: primary[500],
            background: "#FFFFFF",
            foreground: "#16170C",
            content1: "#FFFFFF",
            content2: "#F5F6EE",
            content3: "#EDEEE4",
            divider: "#DEDFD6",
          },
          layout: {
            radius: {
              small: "8px",
              medium: "12px",
              large: "16px",
            },
          },
        },
      },
    }),
  ],
};
