<template>
  <div>
    <h2 class="text-xl">
      Créer une liste:
    </h2>
    <div class="container">
      <form @submit.prevent="onSubmit">
        <input
          v-model="name"
          type="text"
          name="name"
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "mobile-full"
})
useSetPageHeading("Créer")

const name = ref("")
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const onSubmit = async () => {
  const { data: userPublic } = await supabase
    .from("users")
    .select("id", "household_id")
    .eq("user_id", `${user.value.id}`)

  const { data: shoppingList } = await supabase
    .from("shopping_lists")
    .insert([{household_id: userPublic.household_id}])
    .select()

  console.log(shoppingList)
}
</script>

<style scoped>

</style>
