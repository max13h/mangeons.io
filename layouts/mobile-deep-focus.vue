<template>
    <div class="grow overflow-y-scroll">
      <slot />
    </div>
    <MobileSideBar />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>
