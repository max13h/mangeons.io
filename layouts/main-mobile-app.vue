<template>
  <div class="h-screen flex flex-col">
    <MobileHeader />
    <div class="grow overflow-y-scroll">
      <slot />
    </div>
    <MobileNavBar />
    <MobileSideBar />
  </div>
</template>
