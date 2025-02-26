/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      // If you're using the new App Router (in `src/app`):
      "./src/app/**/*.{js,ts,jsx,tsx}",
      
      // If you have a pages directory (in `src/pages`):
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      
      // If you have components in `src/components`:
      "./src/components/**/*.{js,ts,jsx,tsx}",
      
      // If you're using the older structure with no `src/` folder:
      // "./pages/**/*.{js,ts,jsx,tsx}",
      // "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  