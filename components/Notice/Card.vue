<template>
  <div
    class="flex justify-between items-center card sm:max-w-4xl sm:min-w-[24rem] w-fit mt-4 ms-4 transition-all opacity-0 duration-200 overflow-hidden loading-bar"
    :class="[
      showNotice ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full',
    ]"
  >
    <div class="flex items-center">
      <Icon v-if="props.notice.status === 'success'" name="fluent:checkmark-circle-16-regular" size="22px" class="text-green-500 me-2" />
      <Icon v-else-if="props.notice.status === 'error'" name="fluent:error-circle-16-regular" size="21px" class="text-red-500 me-2" />
      <Icon v-else name="fluent:info-16-regular" size="18px" class="text-slate-500 me-2" />
      <p>{{ props.notice.message }}</p>
    </div>
    <Icon name="fluent:dismiss-16-filled" size="1.3rem" class="ms-4" @click="onClose" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  notice: Notice
}>()

const noticeStore = useNoticeStore()

const showNotice = ref(false)

const onClose = () => {
  showNotice.value = false
  setTimeout(() => {
    noticeStore.removeNotice(props.notice.id)
  }, 150)
}

setTimeout(() => {
  showNotice.value = true
}, 100)

const closeTimeout = setTimeout(() => {
  onClose()
}, 10000)

onUnmounted(() => {
  clearTimeout(closeTimeout)
})
</script>

<style scoped>
.loading-bar::after {
  content: "";
  animation: timerAnimation linear forwards 10000ms;
  @apply bg-slate-300 w-0 h-1 absolute bottom-0 left-0 rounded-xl
}
@keyframes timerAnimation {
  to {
    width: 100%;
  }
}
</style>
