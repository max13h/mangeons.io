<template>
  <div>
    <label
      v-if="props.label"
      :for="props.name"
      class="inline-block ms-2"
      :class="props.labelClass"
    >
      {{ capitalize(props.label) }}
    </label>
    <textarea
      :id="props.name"
      v-model="value"
      :name="props.name"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      autofocus
    />
    <div class="mb-4">
      <span
        v-if="errorMessage"
        class="text-red-500 text-sm"
      >
        {{ capitalize(errorMessage) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  disableTab: boolean;
  placeholder?: string;
  value?: string | number
  class?: string;
  label?: string;
  labelClass?: string;
}

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name)

if (props.value) {
  value.value = props.value
}
</script>
