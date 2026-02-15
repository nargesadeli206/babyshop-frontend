/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          soft: "#FFE4E1",
          warm: "#FFB6C1",
          DEFAULT: "#FFB6C1",
        },
        secondary: {
          cream: "#FFF5E6",
          mint: "#E0F2E9",
          lavender: "#E6E6FA",
        },
      },
      fontFamily: {
        playful: ['"Comic Neue"', "cursive"],
        soft: ['"Quicksand"', "sans-serif"],
        rounded: ['"Varela Round"', "sans-serif"],
      },
      borderRadius: {
        "extra-large": "3rem",
        soft: "2rem",
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgba(255, 182, 193, 0.3)",
        warmer: "0 20px 40px -15px rgba(255, 182, 193, 0.4)",
        cute: "0 5px 15px rgba(255, 228, 225, 0.5)",
      },
    },
  },
  plugins: [],
};
