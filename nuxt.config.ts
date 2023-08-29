// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/supabase"],
  app: {
    head: {
      title: "mangeons.io",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Optimises la préparation des repas et simplifier tes courses !"
        }
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        }
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
      exclude: ["/"]
    }
  }
})
