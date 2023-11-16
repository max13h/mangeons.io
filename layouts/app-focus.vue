<template>
  <div class="h-dynamic-screen flex" :class="{ 'flex-col': isMobile }">
    <DesktopNavBar v-if="!isMobile" />
    <DesktopSideBar v-if="!isMobile" />

    <div v-if="!isMobile" class="grow flex flex-col items-center">
      <div class="w-full max-w-3xl my-4">
        <i class="ri-arrow-left-line text-3xl m-3 self-start cursor-pointer" @click="route.query.backPageURL? navigateTo(route.query.backPageURL as any) : router.back()" />
        <div class="overflow-y-scroll p-4">
          <slot />
        </div>
      </div>
    </div>

    <div v-if="isMobile" class="grow flex flex-col w-full">
      <i class="ri-arrow-left-line text-3xl m-3" @click="route.query.backPageURL? navigateTo(route.query.backPageURL as any) : router.back()" />
      <div class="grow overflow-y-scroll p-4 flex justify-center">
        <slot />
      </div>
    </div>
    <MobileNavBar v-if="isMobile" />
    <MobileSideBar v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const device = useDevice()
const isMobile = device.isMobile
</script>
