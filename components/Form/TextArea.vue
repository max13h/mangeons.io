<template>
  <div>
    <label
      v-if="props.label"
      class="inline-block"
      :class="props.labelClass"
      :for="props.name"
    >
      {{ useCapitalize(props.label) }}
    </label>
    <textarea
      v-bind="props.model"
      :name="props.name"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      autofocus
    />
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
  name: string;
  error?: string;
  placeholder?: string;
  disableTab: boolean;
  class?: string
}

const props = defineProps<Props>()
</script>
