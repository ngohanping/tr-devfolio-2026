module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      pingfang: ['PingFangSC', 'sans-serif'],
    },
    extend: {
      screens: {
        xxs: '320px',
        xs: '768px',
        lg: '1286px',
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        // Brand colors
        yellow: {
          5: '#FFFEE6',
          10: '#FFFCCC',
          20: '#FFFCAA',
          40: '#FFFB7F',
          60: '#FFFA55',
          80: '#FFF82B',
          scoot: '#FFF700',
        },
        gray: {
          5: '#F2F2F2',
          10: '#E6E6E6',
          20: '#CCCCCC',
          40: '#999999',
          60: '#666666',
          80: '#333333',
        },
        // Semantic colors
        error: {
          5: '#FDF6F7',
          20: '#F9D9E0',
          100: '#E04264',
        },
        warning: {
          5: '#FEF6F1',
          20: '#F7DCCF',
          100: '#E07742',
        },
        success: {
          5: '#F7FCF5',
          20: '#E1F5E3',
          100: '#6ECE79',
        },
        link: {
          40: '#A3C5F5',
          100: '#186ADE',
        },
        orange: {
          5: '#FFFCF3',
          20: '#FEF1CD',
          100: '#F9BA06',
        },
        kf: {
          5: '#F2F5F9',
          10: '#E5EAF3',
          40: '#99ACCF',
          80: '#33599F',
          100: '#003087',
        },
      },
      spacing: {
        0.25: '0.0625rem',
        0.5: '0.125rem',
        0.625: '0.15625rem',
        0.75: '0.1875rem',
        1: '0.25rem',
        1.25: '0.3125rem',
        1.75: '0.4375rem',
        2.5: '0.625rem',
        3.25: '0.8125rem',
        3.75: '0.9375rem',
        4.5: '1.125rem',
        5: '1.25rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
        // ... additional spacing values
      },
      borderRadius: {
        xs: '0.5rem',
        s: '1rem',
        m: '1.5rem',
      },
      boxShadow: {
        default: '1px 1px 4px rgba(0, 0, 0, 0.1)',
        'profile-account-menu': '1px 1px 4px 1.2px rgba(0, 0, 0, 0.15)',
        'user-profile': '0px 0px 20px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        modal: 9999,
      },
    },
  },
  plugins: [],
};
