<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button type="button" class="btn-close" @click="modalStore.close">
        <i class="ri-close-line text-2xl" />
      </button>
      <slot />
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
  }

  .modal {
    @apply p-4 relative bg-white flex flex-col rounded-3xl border-2 border-secondary;
    box-shadow: 0px 0px 33px 0px #00000063;
    min-width: 200px;
    min-height: 200px;
  }
</style>
