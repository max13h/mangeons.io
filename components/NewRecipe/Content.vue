<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>

    <div ref="el" class="overflow-hidden">
      <div v-for="(step, index) in steps" :key="index" :data-value="step" class="flex items-center border-dashed border-2 border-secondary rounded-xl bg-slate-200 p-4 mb-2">
        <textarea v-model="steps[index]" type="text" class="border-white me-4" />
        <i class="ri-draggable text-2xl drag-element" />
      </div>
    </div>
    <button class="btn-secondary" @click="addStep">Add Step</button>
    <button class="btn-secondary" @click="view">View value</button>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"

const el = ref(null)

onMounted(() => {
  el.value.focus()

  const sortable = new Sortable(el.value, {
    animation: 150,
    ghostClass: "blue-background-class",
    dataIdAttr: "data-value",
    handle: ".drag-element",
    onUpdate: function () {
      console.log(this.toArray())
    }
  })
})

const steps = ref([""])

const addStep = () => {
  steps.value.push("")
}
const view = () => {
  console.log(steps)
}
</script>

<style scoped>
</style>
