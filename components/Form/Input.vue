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
    <input
      v-model="value"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :tabindex="props.disableTab ? '-1' : '0'"
      :class="props.class"
      autofocus
      :value="value"
    >
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
  type: string;
  placeholder?: string;
  value?: string | number
  class?: string;
  disableTab: boolean;
  label?: string;
  labelClass?: string;
  convertUndefinedToNull?: boolean;
}

const props = defineProps<Props>()

const { value, errorMessage } = useField(() => props.name)

if (props.value) {
  value.value = props.value
}

if (props.convertUndefinedToNull) {
  watchEffect(() => {
    if (value.value === "") {
      value.value = null
    }
  })
}
</script>
