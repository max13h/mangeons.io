<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-end">
      <NuxtLink to="/profil/edit" class="flex w-fit">
        <i class="ri-pencil-line" />
        <p>Editer</p>
      </NuxtLink>
    </div>
    <div class="grow">
      <p class="text-2xl mb-4">
        {{ publicUser.username }} 😊
      </p>
      <ProfilInfo label="Prénom" :value="publicUser.first_name" class="mb-3" />
      <ProfilInfo label="Nom de famille" :value="publicUser.last_name" class="mb-3" />
      <ProfilInfo label="Age" :value="publicUser.age" />
    </div>
    <button @click="logOut">
      LOG OUT
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})

const logOut = async () => {
  const supabase = useSupabaseClient()

  await supabase.auth.signOut()

  return navigateTo("/login")
}

const publicUser = await useGetPublicUser()

</script>
