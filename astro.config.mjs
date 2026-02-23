import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cognigami.github.io',
  base: '/profile/', 
  build: {
    assets: 'assets'
  }
});
