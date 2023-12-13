<template>
  <div class="w-full h-dynamic-screen flex flex-col justify-center items-center text-center">
    <NuxtImg src="/logos/LONG_LIGHT_LOGO.svg" alt="mangeons.io logo" width="200px" class="my-8" />
    <div class="grow flex flex-col items-center justify-center">
      <div v-if="error.statusCode === 404" class="w-full p-8">
        <h1 class="text-6xl w-full">
          404
        </h1>
        <p class="text-xl">
          Désolé, cette page ne semble pas exister
        </p>
      </div>
      <div v-else>
        <h1>Dang</h1>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
        <p>It looks like something broke.</p>
        <p>Sorry about that.</p>
      </div>
      <NuxtLink to="/" class="btn-primary">
        Retourner à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const error = useError()
</script>
