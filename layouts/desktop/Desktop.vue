<template>
  <div class="h-screen flex relative">
    <DesktopNavBar />
    <DesktopSideBar />
    <div class="grow flex justify-center px-16">
      <div class="overflow-y-scroll w-full max-w-4xl">
        <slot />
      </div>
    </div>
  </div>
</template>
