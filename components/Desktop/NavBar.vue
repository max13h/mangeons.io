<template>
  <nav class="flex flex-col justify-center items-center bg-primary w-16 h-full select-none z-50 drop-shadow-[0px_0px_3px_rgba(0,0,0,0.25)] rounded-tr-md rounded-br-md py-2">
    <div class="flex flex-col items-center flex-grow link-list">
      <NuxtLink to="/app/listes-de-course" exact-active-class="active-link" title="Liste de course">
        <Icon name="fluent:receipt-16-filled" size="2.5rem" class="text-light" />
      </NuxtLink>

      <NuxtLink to="/app/menus" exact-active-class="active-link" title="Menus">
        <Icon name="fluent:food-16-filled" size="2.5rem" class="text-light" />
      </NuxtLink>

      <NuxtLink to="/app/recettes" exact-active-class="active-link" title="Recettes">
        <Icon name="fluent:notebook-20-filled" size="2.5rem" class="text-light" />
      </NuxtLink>
    </div>
    <div class="flex flex-col items-center link-list">
      <Icon :name="pageStore.isSideBarOpen ? 'fluent:arrow-export-rtl-16-filled' : 'fluent:arrow-export-ltr-16-filled'" size="2.2rem" class="text-light" @click="useToggleSideBar" />

      <NuxtLink to="/app/notifications" exact-active-class="active-link" title="Notifications">
        <Icon name="fluent:alert-16-filled" size="2.2rem" class="text-light" />
      </NuxtLink>

      <NuxtLink to="/app/profil" exact-active-class="active-link" title="Profil">
        <Icon name="fluent:person-16-filled" size="2.5rem" class="text-light" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const pageStore = usePageStore()
</script>

<style scoped>
.link-list * {
  @apply my-1
}
</style>
