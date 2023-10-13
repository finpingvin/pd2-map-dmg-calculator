// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/pd2-map-dmg-calculator/',
    // names with underscore (_nuxt) messes with github pages.
    // it might consider it jekyll stuff.
    buildAssetsDir: 'assets',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
  ],
  devtools: {
    enabled: true,
  },
})
