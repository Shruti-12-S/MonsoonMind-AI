/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        field: {
          50: "#ecfdf5",
          100: "#ccfbf1",
          400: "#2dd4bf",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
          900: "#134e4a"
        },
        skydata: {
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          700: "#0e7490",
          900: "#164e63"
        },
        sunrisk: {
          50: "#fff1f2",
          100: "#ffe4e6",
          400: "#fb7185",
          500: "#f43f5e",
          700: "#be123c"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(6, 182, 212, 0.2)"
      }
    }
  },
  plugins: []
};
