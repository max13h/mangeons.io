<template>
  <div class="h-dynamic-screen bg-light flex flex-col items-center p-4 text-center">
    <div class="flex-grow flex flex-col items-center p-4">
      <NuxtImg src="/logos/LONG_LIGHT_LOGO.svg" class="w-[66%] my-8" />
      <h1 class="">
        Optimiser la préparation de vos repas et simplifier vos courses !
      </h1>
      <p class="my-8">
        ⚠️ Site en construction ⚠️
      </p>
    </div>
    <div class="flex flex-col items-center w-full md:w-72">
      <NuxtLink to="/auth/inscription" class="btn-primary w-full">
        Inscription
      </NuxtLink>
      <NuxtLink to="/auth/connexion" class="btn-outline-primary mt-4 w-full">
        Connexion
      </NuxtLink>
    </div>
  </div>
</template>
