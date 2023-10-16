<template>
  <div class="h-screen flex flex-col">
    <i class="ri-arrow-left-line text-3xl mt-3 ml-3 mr-3" @click="router.back()" />
    <div class="grow overflow-y-scroll">
      <slot />
    </div>
    <MobileSideBar />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>
