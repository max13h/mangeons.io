<template>
  <div class="mb-2">
    <label :for="props.model.value">{{ userCapitalize(props.label) }}</label>
    <textarea
      :id="props.model.value"
      v-bind="props.model"
      :name="props.model.value"
      autofocus
      class="w-full"
      :class="{ 'min-h-[75px]': props.size == 'sm', 'min-h-[130px]': props.size == 'md', 'min-h-[200px]': props.size == 'lg' }"
    />
    <span
      v-if="error"
      class="pb-2 text-red-500 text-sm"
    >
      {{ userCapitalize(error) }}
    </span>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  label: string,
  model: any,
  error: string | null,
  size: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "LABEL",
  type: "TYPE",
  error: null,
  size: "sm"
})
</script>
