<template>
  <div>
    <p>PROFIL PAGE</p>
    <button @click="logOut">
      LOG OUT
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "main-mobile-app"
})
useSetPageHeading("Profil")

const logOut = async () => {
  const supabase = useSupabaseClient()

  await supabase.auth.signOut()

  return navigateTo("/login")
}
</script>
