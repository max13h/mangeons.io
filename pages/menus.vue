<template>
  <div>
    <div v-if="menus?.length === 0">
      You don't have any menu created
    </div>
    <div v-else>
      <h2>Here are your menus</h2>
      <div v-for="(menu, index) in menus" :key="index">
        <CardMenu :menu="menu" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app"
})
useSetPageHeading("Menus")

const supabase = useSupabaseClient()

const { data: menus } = await supabase
  .from("menus")
  .select("name,created_at")

</script>
