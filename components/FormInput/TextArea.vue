<template>
  <div class="mb-2">
    <label :for="props.model.value">{{ useCapitalize(props.label) }}</label>
    <textarea
      :id="props.model.value"
      v-bind="props.model"
      :name="props.model.value"
      autofocus
      class="w-full"
      :class="{ 'min-h-[75px]': props.size == 'sm', 'min-h-[130px]': props.size == 'md', 'min-h-[300px]': props.size == 'lg' }"
      :placeholder="props.placeholder"
      tabindex="-1"
    />
    <span
      v-if="error"
      class="pb-2 text-red-500 text-sm"
    >
      {{ useCapitalize(error) }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string,
  model: any,
  error: string | null,
  size: string,
  placeholder: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "TYPE",
  error: null,
  size: "sm",
  placeholder: ""
})
</script>
