<template>
  <div>
    <label
      v-if="props.label"
      :for="props.name"
      class="inline-block"
      :class="props.labelClass"
    >
      {{ useCapitalize(props.label) }}
    </label>
    <input
      v-bind="props.model"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      autofocus
      :value="props.value"
    >
    <div class="mb-4">
      <span
        v-if="props.error"
        class="text-red-500 text-sm"
      >
        {{ useCapitalize(props.error) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  labelClass?: string;
  model: any;
  type: string;
  name: string;
  error?: string;
  placeholder?: string;
  disableTab: boolean;
  class?: string;
  value?: string | number
}

const props = defineProps<Props>()
</script>
