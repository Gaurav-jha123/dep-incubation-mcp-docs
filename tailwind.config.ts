import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}", // include Storybook stories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;