import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://stroix-leads.ru',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  integrations: [react(), sitemap()],
});
