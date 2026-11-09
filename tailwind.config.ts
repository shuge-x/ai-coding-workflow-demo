import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#182230",
        muted: "#667085",
        line: "#e7eaf0",
        canvas: "#f6f7fb",
        brand: "#4263eb"
      }
    }
  },
  plugins: []
};

export default config;
