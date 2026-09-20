import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: '#27628C',
      }
    }
  }
}
