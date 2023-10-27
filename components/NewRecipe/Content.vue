<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>

    <div ref="mainStepList" class="overflow-hidden">
      <div
        v-for="(step, index) in stepList"
        :key="index"
        :data-value="step.value"
        class="border-dashed border-2 border-secondary rounded-xl bg-slate-200 p-4 mb-2"
      >
        <div class="flex items-center">
          <textarea
            ref="inputElements"
            v-model="stepList[index].value"
            type="text"
            class="border-white me-4"
          />
          <i class="ri-settings-3-line text-2xl me-4" @click="showOption(index)" />
          <Teleport v-if="(modalStore.whatIsOpen == 'recipeStepSetting') && (optionIndex == index)" to="#modal">
            <div class="flex flex-col justify-center h-full w-full">
              <button type="button" class="btn-outline-secondary mb-4">
                Supprimer l'étape
              </button>
              <button
                type="button"
                class="btn-outline-secondary"
                @click="addNestedStep(index)"
              >
                Ajouter une sous-étape
              </button>
            </div>
          </Teleport>
          <i class="ri-draggable text-2xl drag-element" />
        </div>
        <div ref="nestedStepLists" class="border-dashed border-2 border-secondary bg-slate-300 rounded-xl mt-2 p-4">
          <div
            v-for="(nestedStep, nestedIndex) in stepList[index].nested"
            :key="nestedIndex"
            class="flex items-center mb-4"
            :data-value="nestedStep"
          >
            <i class="ri-delete-bin-line text-xl me-4" />
            <textarea
              ref="inputElements"
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
import { useModalStore } from "../../stores/modalStore"

const modalStore = useModalStore()

const mainStepList = ref(null)
const nestedStepLists = ref([])
const inputElements = ref([])

const stepList = ref([
  {
    value: "first",
    nested: ["hello", "test"]
  },
  {
    value: "second",
    nested: ["hello", "tededzst"]
  },
  {
    value: "third",
    nested: ["hello", "tededzst"]
  }
])

const optionIndex: globalThis.Ref<number> = ref(0)

const showOption = (index: number) => {
  useOpenModal("recipeStepSetting")
  optionIndex.value = index
}

const addStep = () => {
  steps.value.push("")
}

const addNestedStep = (index) => {
  stepList.value[index].nested.push("")
}

onMounted(() => {
  const sortable = new Sortable(mainStepList.value, {
    animation: 150,
    dataIdAttr: "data-value",
    handle: ".drag-element",
    onUpdate: function (evt) {
      console.log(this.toArray())
      console.log(evt.item)
    }
  })

  nestedStepLists.value.forEach((element) => {
    const nestedSortable = new Sortable(element, {
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      handle: ".drag-nested-element",
      dataIdAttr: "data-value",
      onUpdate: function () {
        console.log(this.toArray())
      }
    })
  })
})
</script>

<style scoped>
</style>
