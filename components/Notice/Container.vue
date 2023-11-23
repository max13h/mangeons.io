<template>
  <div class="absolute bottom-4 right-4 flex flex-col items-end z-50">
    <div
      v-for="notice in noticeStore.notices"
      :key="notice.id"
    >
      <NoticeCard :notice="notice" />
    </div>
  </div>
</template>

<script setup lang="ts">
const noticeStore = useNoticeStore()
</script>
