<template>
  <div class="h-dynamic-screen flex" :class="{ 'flex-col': isMobile }">
    <DesktopNavBar v-if="!isMobile" />
    <DesktopSideBar v-if="!isMobile" />
    <div v-if="!isMobile" class="grow flex flex-col items-center relative overflow-hidden">
      <div class="w-full h-full max-w-3xl my-4">
        <div class="w-full h-full overflow-y-scroll p-4">
          <slot />
        </div>
      </div>
      <NoticeContainer />
    </div>

    <MobileHeader v-if="isMobile" />
    <div v-if="isMobile" class="grow flex flex-col w-full relative overflow-hidden">
      <div class="grow overflow-y-scroll p-4 flex justify-center">
        <slot />
      </div>
      <NoticeContainer />
    </div>
    <MobileNavBar v-if="isMobile" />
    <MobileSideBar v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
const device = useDevice()
const isMobile = device.isMobile
</script>
