<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>

    <div ref="mainStepList" class="overflow-hidden">
      <div
        v-for="(step, index) in stepList"
        :key="index"
        :data-value="step"
        class="border-dashed border-2 border-secondary rounded-xl bg-slate-200 p-4 mb-2"
      >
        <div class="flex items-center">
          <textarea
            v-model="stepList[index].value"
            type="text"
            class="border-white me-4"
          />
          <i class="ri-draggable text-2xl drag-element" />
          <p @click="addNestedElement(index)">
            ADD
          </p>
        </div>
        <div ref="nestedStepLists" class="border-dashed border-2 border-secondary bg-slate-300 rounded-xl mt-2 p-4">
          <div
            v-for="(nestedElement, nestedIndex) in stepList[index].nested"
            :key="nestedIndex"
            class="flex items-center mb-4"
          >
            <textarea
              v-model="stepList[index].nested[nestedIndex]"
              type="text"
              class="border-white me-4"
            />
            <i class="ri-draggable text-2xl drag-nested-element" />
          </div>
        </div>
      </div>
    </div>
    <button class="btn-secondary" @click="addStep">Add Step</button>
    <button class="btn-secondary" @click="view">View value</button>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"

const mainStepList = ref(null)
const nestedStepLists = ref([])

const stepList = ref([
  {
    value: "first",
    nested: ["hello", "test"]
  },
  {
    value: "second",
    nested: ["hello", "test"]
  }
])

onMounted(() => {
  const sortable = new Sortable(mainStepList.value, {
    animation: 150,
    ghostClass: "blue-background-class",
    dataIdAttr: "data-value",
    handle: ".drag-element",
    onUpdate: function () {
      console.log(this.toArray())
    }
  })

  nestedStepLists.value.forEach((element) => {
    const nestedSortable = new Sortable(element, {
      group: "nested",
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65
    })
  })
})

const addNestedElement = (index) => {
  stepList.value[index].nested.push("")
}

const addStep = () => {
  steps.value.push("")
}
const view = () => {
  console.log(steps)
}

</script>

<style scoped>
</style>
