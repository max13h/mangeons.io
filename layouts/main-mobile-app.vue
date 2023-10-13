<template>
  <div class="h-screen flex flex-col">
    <MobileHeader />
    <div class="grow overflow-y-scroll p-4">
      <slot />
    </div>
    <MobileNavBar />
    <MobileSideBar />
  </div>
</template>
