import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://alexdevflow.github.io',
  base: '/',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      // The root only redirects to /en/ or /it/: listing it would offer
      // Google a URL that is never indexed.
      filter: (page) =>
        !page.includes('/fiorista/') && page !== 'https://alexdevflow.github.io/',
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
  },
  build: {
    format: 'directory'
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  }
});
