module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary:   '#FFD900',
        secondary: '#000000',
        tertiary:  '#FFFFFF',
        neutral:   '#F4F4F4',
        node: {
          service:  '#22c55e',
          proposed: '#f97316',
          muted:    '#9ca3af',
        },
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body:     ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
