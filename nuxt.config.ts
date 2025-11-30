// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-30",
  app: {
    baseURL: "/pd2-map-dmg-calculator/",
    // names with underscore (_nuxt) messes with github pages.
    // it might consider it jekyll stuff.
    buildAssetsDir: "assets",
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
  ],
});
