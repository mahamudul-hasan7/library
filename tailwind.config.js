/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './**/*.html',
    './**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'on-tertiary-container': '#4a4f69',
        'primary-dim': '#00539a',
        'tertiary-fixed': '#dadefe',
        primary: '#005faf',
        'on-surface-variant': '#596061',
        'inverse-primary': '#4e9af9',
        error: '#9f403d',
        'surface-container-high': '#e4e9ea',
        'on-secondary-container': '#46545d',
        surface: '#f9f9f9',
        'on-secondary': '#f4faff',
        'surface-container-lowest': '#ffffff',
        'on-tertiary-fixed': '#383c55',
        'primary-fixed-dim': '#bdd6ff',
        'inverse-on-surface': '#9c9d9d',
        'on-tertiary-fixed-variant': '#545873',
        'surface-container-low': '#f2f4f4',
        'secondary-container': '#d6e5ef',
        background: '#f9f9f9',
        'on-surface': '#2d3435',
        'tertiary-dim': '#4d526c',
        'surface-dim': '#d3dbdd',
        'secondary-dim': '#47555e',
        'primary-container': '#d4e3ff',
        'outline-variant': '#acb3b4',
        tertiary: '#595e78',
        'surface-bright': '#f9f9f9',
        'secondary-fixed-dim': '#c8d6e1',
        'on-primary-fixed': '#004079',
        'on-primary-container': '#005299',
        secondary: '#53616a',
        'surface-variant': '#dde4e5',
        'tertiary-container': '#dadefe',
        'error-container': '#fe8983',
        'on-tertiary': '#faf8ff',
        'on-background': '#2d3435',
        'on-error-container': '#752121',
        'inverse-surface': '#0c0f0f',
        'surface-container': '#ebeeef',
        'surface-tint': '#005faf',
        'on-secondary-fixed': '#33414a',
        outline: '#757c7d',
        'on-error': '#fff7f6',
        'secondary-fixed': '#d6e5ef',
        'tertiary-fixed-dim': '#ccd0ef',
        'on-secondary-fixed-variant': '#4f5d67',
        'error-dim': '#4e0309',
        'on-primary-fixed-variant': '#005caa',
        'on-primary': '#f6f7ff',
        'surface-container-highest': '#dde4e5',
        'primary-fixed': '#d4e3ff'
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px'
      }
    }
  },
  plugins: []
};
