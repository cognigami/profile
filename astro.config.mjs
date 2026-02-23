import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cognigami.github.io',
  base: '/profile', // uncomment if not using root domain
  build: {
    assets: 'assets'
  }
});
