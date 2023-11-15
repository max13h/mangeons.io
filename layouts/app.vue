<template>
  <div class="h-dynamic-screen flex" :class="{ 'flex-col': isMobile }">
    <DesktopNavBar v-if="!isMobile" />
    <DesktopSideBar v-if="!isMobile" />
    <div v-if="!isMobile" class="grow flex justify-center px-16">
      <div class="overflow-y-scroll w-full max-w-4xl">
        <slot />
      </div>
    </div>
    <div v-if="isMobile" class="grow overflow-y-scroll p-4">
      <slot />
    </div>
    <MobileNavBar v-if="isMobile" />
    <MobileSideBar v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
const device = useDevice()
const isMobile = device.isMobile
</script>
