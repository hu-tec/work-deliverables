module.exports = {
  content: ['./디자인시스템/resource/DB_v2_HTML/*.html'],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fc',
        foreground: '#222222',
        card: '#ffffff',
        'card-foreground': '#222222',
        primary: '#0088ff',
        'primary-foreground': '#ffffff',
        secondary: '#eff0fa',
        'secondary-foreground': '#222222',
        muted: '#f4f5f8',
        'muted-foreground': '#666666',
        accent: '#e8f3ff',
        'accent-foreground': '#222222',
        destructive: '#dc3d3d',
        border: '#e3e5ed',
        input: '#e3e5ed',
        ring: '#0088ff',
      },
      borderRadius: { lg: '8px', md: '6px', sm: '4px' },
    },
  },
  plugins: [],
};
