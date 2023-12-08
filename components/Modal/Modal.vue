<template>
  <div class="modal-backdrop">
    <div class="modal" tabindex="0" @keydown.esc="modalStore.close">
      <div class="btn-close-container mb-2">
        <button type="button" class="ri-close-line" @click="modalStore.close" />
      </div>
      <div class="overflow-y-scroll">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ========== HOW TO USE MODAL========
// Write you modal content inside of /components/Modal
// Add you component to the page you want and wrap it into a <Teleport to="#modal">
// ====================================

import { useModalStore } from "../../stores/modalStore"

const modalStore = useModalStore()
</script>

<style scoped>
   .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    @apply relative bg-white flex flex-col card overflow-y-scroll w-full m-4;
    box-shadow: 0px 0px 33px 0px #00000063;
    min-width: 200px;
    max-width: 640px;
    max-height: 80vh;
  }
</style>
