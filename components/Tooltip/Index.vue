<template>
  <div class="flex justify-center items-center tooltip">
    <Icon name="fluent:question-circle-16-regular" size="1.2rem" />
    <div
      class="tooltip-content card"
      :class="[position, props.tooltipClass]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  position: string;
  tooltipClass?: string
}>()

const position = ref(`tooltip-${props.position}`)
</script>

<style scoped>
.tooltip {
  @apply relative
}

.tooltip:hover {
  @apply cursor-help
}

.tooltip .tooltip-content {
  @apply absolute w-fit border-2 border-dark z-10  transition-opacity duration-200 invisible opacity-0
}

.tooltip:hover .tooltip-content {
  @apply visible opacity-100
}

.tooltip-top {
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left {
  top: 5px;
  right: 125%;
  transform: translateY(-50%)
}

.tooltip-right {
  top: 5px;
  left: 125%;
  transform: translateY(-50%)
}
</style>
