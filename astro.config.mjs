import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cognigami.github.io',
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});
