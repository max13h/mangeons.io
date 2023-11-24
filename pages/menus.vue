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
    <button type="button" class="btn-primary" @click="noticeStore.addNotice(`Bonjouaaaaar c'e dijdzoi ojezio ozid jei deijjd eist un test`, `error`)">CLICK TO ADD NOTICE</button>
    <button @click="logOut">
      LOG OUT
    </button>
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

const noticeStore = useNoticeStore()

const logOut = async () => {
  const supabase = useSupabaseClient()

  await supabase.auth.signOut()

  return navigateTo("/login")
}
</script>
