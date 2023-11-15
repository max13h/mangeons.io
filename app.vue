<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Modal v-show="modalStore.isOpen">
      <div id="modal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "./stores/modalStore"

const modalStore = useModalStore()
</script>
