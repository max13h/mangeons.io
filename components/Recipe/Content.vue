<template>
  <div>
    <div v-for="step in contentObject" :key="step.id" class="card">
      <p class="bold text-lg">
        Étape {{ step.index + 1 }}
      </p>
      <p>{{ step.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: any;
}>()

const contentObject = useParseStringToStepListObject(props.content)

console.log(contentObject);
</script>

<style scoped>

</style>
