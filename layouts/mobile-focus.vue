<template>
  <div class="h-screen flex flex-col">
    <i class="ri-arrow-left-line text-3xl m-3" @click="route.query.backPageURL? navigateTo(route.query.backPageURL as any) : router.back()" />
    <div class="grow overflow-y-scroll p-4">
      <slot />
    </div>
    <MobileNavBar />
    <MobileSideBar />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
</script>
