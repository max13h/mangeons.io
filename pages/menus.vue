<template>
    <p>MENUS PAGE</p>
</template>

<script setup lang="ts">
import { useCounterStore } from "../stores/useCounterStore";

definePageMeta({
  layout: "main-mobile-app",
});

const store = useCounterStore()
</script>