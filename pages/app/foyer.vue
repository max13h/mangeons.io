<template>
  <div class="w-full">
    <select name="household" class="w-fit text-xl border-none">
      <option v-for="(household, index) in households" :key="index">
        {{ household.name }}
      </option>
    </select>
    <div v-for="(household, index) in households" :key="index" class="w-full mt-4">
      <HouseholdContent :content="household" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})

const publicUser = await usePublicUser()

const { data: households, error } = await useFetch("/api/household/households", {
  method: "get",
  query: { id: publicUser.value.id }
})

if (error.value) {
  throw new Error("Error on fetch")
}

console.log(households);
</script>

<style scoped>

</style>
