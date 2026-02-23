import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  // base: '/YOUR-REPO-NAME', // uncomment if not using root domain
  build: {
    assets: '_assets'
  }
});
