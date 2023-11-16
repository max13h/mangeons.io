<template>
  <div class="h-dynamic-screen flex" :class="{ 'flex-col': isMobile }">
    <DesktopNavBar v-if="!isMobile" />
    <DesktopSideBar v-if="!isMobile" />

    <div v-if="!isMobile" class="grow flex flex-col items-center overflow-hidden">
      <div class="w-full h-full max-w-3xl py-4 flex flex-col">
        <i class="ri-arrow-left-line text-3xl m-3 self-start cursor-pointer w-full" @click="route.query.backPageURL? navigateTo(route.query.backPageURL as any) : router.back()" />
        <div class="overflow-y-scroll p-4 w-full h-full">
          <slot />
        </div>
      </div>
    </div>

    <div v-if="isMobile" class="grow flex flex-col overflow-hidden">
      <i class="ri-arrow-left-line text-3xl m-3" @click="route.query.backPageURL? navigateTo(route.query.backPageURL as any) : router.back()" />
      <div class="grow w-full overflow-y-scroll sm:p-4 overflow-x-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const device = useDevice()
const isMobile = device.isMobile
</script>
