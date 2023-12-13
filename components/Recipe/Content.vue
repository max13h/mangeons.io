<template>
  <div>
    <div v-for="step in contentObject" :key="step.id" class="rounded-2xl bg-white dotted p-4 mb-4 shadow-none">
      <p class="text-lg italic underline mb-2">
        Étape {{ step.index + 1 }}
      </p>
      <p class="mb-4 text-lg">
        {{ step.value }}
      </p>
      <div v-for="nestedStep in step.nested" :key="nestedStep.id" class="card shadow-none bg-slate-100 mb-4 flex">
        <p class="italic me-2">
          {{ nestedStep.index + 1 }}.
        </p>
        <p>{{ nestedStep.value }}</p>
      </div>
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
