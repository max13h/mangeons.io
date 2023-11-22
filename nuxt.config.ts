// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@vee-validate/nuxt",
    "@nuxt/image",
    "@vite-pwa/nuxt",
    "@nuxtjs/device",
    "nuxt-icon"
  ],
  imports: {
    dirs: ["stores",
      "types"
    ]
  },
  app: {
    head: {
      title: "mangeons.io",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Optimises la préparation des repas et simplifie tes courses !" },
        { name: "theme-color", content: "#14cc60" }
      ],
      link: [
        { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "mask-icon", href: "/mask-icon.svg", color: "#FFFFFF" }
      ],
      noscript: [{ children: "JavaScript is required" }]
    }
  },
  typescript: {
    strict: true
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore" // import { defineStore } from 'pinia'
    ]
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/register"]
    }
  },
  device: {
    refreshOnResize: true
  }
})
