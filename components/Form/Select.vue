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
      v-model="value"
      :name="props.name"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      autofocus
    >
      <option
        v-for="option, index in props.options"
        :key="index"
        :value="Array.isArray(option) ? option[0] : option"
        :selected="props.value === (Array.isArray(option) ? option[0] : option) ? true : false"
      >
        {{ Array.isArray(option) ? option[1] : option }}
      </option>
    </select>
    <div class="mb-4">
      <span
        v-if="errorMessage"
        class="text-red-500 text-sm"
      >
        {{ useCapitalize(errorMessage) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  options: any[]
  name: string;
  placeholder?: string;
  value?: string;
  class?: string;
  disableTab: boolean;
  label?: string;
  labelClass?: string;
}

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name)

if (props.value) {
  value.value = props.value
}
</script>

<style scoped>

</style>
