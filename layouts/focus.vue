<template>
  <div class="h-screen flex flex-col">
    <i class="ri-arrow-left-line text-3xl m-3" @click="router.back()" />
    <div class="grow overflow-y-scroll p-4">
      <slot />
    </div>
    <MobileNavBar />
    <MobileSideBar />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>
