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
    <select
      v-bind="props.model"
      :name="props.name"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      class="h-[2rem]"
      autofocus
    >
      <option
        v-for="option, index in props.options"
        :key="index"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
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
  class?: string;
  options: string[]
}

const props = defineProps<Props>()
</script>

<style scoped>

</style>
