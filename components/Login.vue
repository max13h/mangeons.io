<template>
  <div class="border-2 border-dark w-full mx-2 md:w-[600px] bg-light p-3 rounded-lg">
    <h1 class="text-3xl mb-3">
      Login
    </h1>
    <form action="" method="get" class="flex flex-col">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" class="mb-2 p-1 border-2 border-secondary rounded-lg" autofocus>
      <label for="password">Password</label>
      <input id="password" type="password" name="password" class="mb-4 p-1 border-2 border-secondary rounded-lg">
      <input type="submit" value="Se connecter" class="bg-secondary text-light py-1 rounded-lg">
    </form>
    <NuxtLink to="/" class="text-secondary p-3 flex justify-center">
      Créer un compte
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
