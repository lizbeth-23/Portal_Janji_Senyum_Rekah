/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rekah: {
          blue: "#5798D7",
          dark: "#4483C2",
          light: "#E6F1FA",
          lime: "#B9C255",
          limeDark: "#A4AD45",
          limeLight: "#F7F9E8",
          bg: "#F4F8FC",
          panel: "#FFFFFF",
          text: "#1F2937",
          muted: "#5A6B78",
        },
        status: {
          menunggu: "#F59E0B",
          dikonfirmasi: "#2563EB",
          hadir: "#7C3AED",
          selesai: "#15A66A",
          dibatalkan: "#E53935",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
