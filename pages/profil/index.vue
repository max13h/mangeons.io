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

      <div class="mt-16">
        <p class="text-xl mb-4">
          Votre foyer
        </p>
        <div class="w-full border-2 border-dashed border-secondary rounded-xl min-h-[100px] p-4 flex justify-center items-center">
          <div v-if="households && households.length > 0">
            <HouseholdProfilCard v-for="(household, index) in households" :key="index" :id="household" />
          </div>
          <div v-else class="flex flex-col items-center">
            <p class="text-lg mb-4">
              Vous n'avez pas encore de foyer
            </p>
            <NuxtLink to="/foyer" class="btn-secondary">
              Rejoindre ou créer
            </NuxtLink>
          </div>
        </div>
      </div>
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

const { data: households, error } = await useFetch("/api/household/userHouseholds", {
  method: "get",
  query: { id: publicUser.value.id }
})

if (error.value) {
  throw new Error("Error on fetch")
}

</script>
