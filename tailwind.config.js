// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'Chalkstick': ['var(--chalk-stick-font)', 'sans-serif'],
        'CreamyChalk': ['var(--creamy-chalk-font)', 'sans-serif'],
        'EasterChalk': ['var(--easter-chalk-font)', 'sans-serif'],
        'BureeChalk': ['var(--buree-chalk-font)', 'sans-serif'],
      },
    },
  },
  plugins: [
    // require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};