<template>
  <div class="mb-2">
    <label :for="props.model.value">{{ userCapitalize(props.label) }}</label>
    <input
      :id="props.model.value"
      v-bind="props.model"
      :type="props.type"
      :name="props.model.value"
      :placeholder="props.placeholder"
      autofocus
    >
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
  type: string,
  error: string | null,
  placeholder: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  error: null,
  placeholder: ""
})
</script>
