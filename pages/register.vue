<template>
  <div>
    <h1 class="text-3xl mb-3">
      Inscription
    </h1>
    <form action="" method="get" class="flex flex-col">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" class="mb-2 p-1 border-2 border-secondary rounded-lg input-text" autofocus>
      <label for="password">Mot de passe</label>
      <input id="password" type="password" name="password" class="mb-4 p-1 border-2 border-secondary rounded-lg input-text">
      <label for="confirm-password">Confirmer le mot de passe</label>
      <input id="confirm-password" type="password" name="confirm-password" class="mb-4 p-1 border-2 border-secondary rounded-lg input-text">
      <input type="submit" value="S'inscrire" class="bg-secondary text-light py-1 rounded-lg">
    </form>
    <NuxtLink to="/login" class="text-secondary p-3 flex justify-center">
      Se connecter
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})
</script>

<style scoped>

</style>
