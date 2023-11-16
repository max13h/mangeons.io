<template>
  <aside
    class="transform fixed top-0 left-16 w-96 h-dynamic-screen bg-light ease-in-out transition-all duration-300 z-30"
    :class="pageStore.isSideBarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <MobileSideBarContent />
  </aside>
  <div v-if="pageStore.isSideBarOpen" class="overlay absolute bg-dark opacity-50 w-screen h-dynamic-screen -z-01" @click="useToggleSideBar" />
</template>

<script setup lang="ts">
const pageStore = usePageStore()
</script>
