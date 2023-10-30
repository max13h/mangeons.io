<template>
  <div>
    <h2 class="text-xl mb-4 min-h-[56px]">
      Décrivrez <span class="underline">étape</span> par <span class="underline">étape</span> comment réussir votre recette 🔪
    </h2>

    <div ref="mainStepList" class="overflow-hidden">
      <div
        v-for="(step, index) in stepList"
        :key="index"
        :data-value="step.id"
        class="border-dashed border-2 border-secondary rounded-xl bg-slate-200 p-4 mb-2"
      >
        <div class="flex items-center">
          <p class="text-lg">
            {{ step.index + 1 }}.
          </p>
          <textarea
            ref="inputElements"
            v-model="step.value"
            type="text"
            class="border-white mx-4"
          />
          <i class="ri-settings-3-line text-2xl me-4" @click="showOptions(index)" />
          <Teleport v-if="(modalStore.whatIsOpen == 'recipeStepSetting') && (optionIndex == index)" to="#modal">
            <div class="flex flex-col justify-center h-full w-full">
              <button type="button" class="btn-outline-secondary mb-4" @click="removeStep(index)">
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
        <div v-if="step.nested.length !== 0" ref="nestedStepLists" class="border-dashed border-2 border-secondary bg-slate-300 rounded-xl mt-2 p-4">
          <div
            v-for="(nestedStep, nestedIndex) in stepList[index].nested"
            :key="nestedIndex"
            class="flex items-center mb-4"
            :data-value="nestedStep.id"
          >
            <p class="text-base">
              {{ nestedStep.index + 1 }}.
            </p>
            <textarea
              ref="inputElements"
              v-model="stepList[index].nested[nestedIndex].value"
              type="text"
              class="border-white mx-4"
            />
            <i class="ri-delete-bin-line text-xl me-4" />
            <i class="ri-draggable text-2xl drag-nested-element" />
          </div>
        </div>
      </div>
    </div>
    <button class="btn-secondary" @click="addStep">
      Ajouter une étape
    </button>
    <button class="btn-secondary" @click="console.log(mainSortableList.toArray());">
      AAAAA
    </button>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"
import { useModalStore } from "../../stores/modalStore"

const modalStore = useModalStore()

const mainStepList = ref(null)
const nestedStepLists: globalThis.Ref<any[]> = ref([])
const inputElements = ref([])

interface StepsList {
  id: number;
  value: string;
  nested: {
    id: number;
    value: string;
    index: number
  }[];
  index: number
}

const stepList: globalThis.Ref<StepsList[]> = ref([
  {
    id: 0,
    value: "0",
    nested: [],
    index: 0
  }
])

const optionIndex: globalThis.Ref<number> = ref(0)

const showOptions = (index: number) => {
  useOpenModal("recipeStepSetting")
  optionIndex.value = index
}

const addStep = () => {
  const promise = new Promise((resolve, _reject) => {
    if (stepList.value.push({
      id: stepList.value.length,
      value: `${stepList.value.length}`,
      nested: [],
      index: stepList.value.length
    })) {
      resolve(true)
    } else {
      throw new Error("error")
    }
  })
  _reorderTheListMainFromHTML(promise)
}

const addNestedStep = (index: number) => {
  const promise = new Promise((resolve, _reject) => {
    resolve(stepList.value[index].nested.push({
      id: stepList.value[index].nested.length,
      value: "",
      index: stepList.value[index].nested.length
    }))
  })
  _reorderTheListNestedFromHTML(promise, index)

  modalStore.close()

  // Init nested sortable lists
  nestedStepLists.value.forEach((element) => {
    const nestedSortable = new Sortable(element, {
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      handle: ".drag-nested-element",
      dataIdAttr: "data-value",
      onUpdate: function () {
        editEachIndexInNestedStepList(this.toArray(), index)
      }
    })
  })
}

// const removeStep = (index: number) => {
//   const reorderedArray = mainSortableList.toArray()
//   reorderedArray.splice(reorderedArray.indexOf(index.toString()), 1)

//   stepList.value.splice(index, 1)

//   console.log("reorderedArray", reorderedArray)
//   console.log("stepList avant", stepList.value)

//   setTimeout(() => {
//     stepList.value.forEach((step, index) => {
//       step.index = reorderedArray.indexOf((index + 1).toString()) + 1
//     })
//     console.log("stepList apres", stepList.value)
//   }, 5000);

//   modalStore.close()
// }

const editEachIndexInStepList = (reorderedArray: string[]) => {
  stepList.value.forEach((step, index) => {
    step.index = reorderedArray.indexOf(index.toString())
  })
}

const editEachIndexInNestedStepList = (reorderedArray: string[], index: number) => {
  const formatedReorderedArray = reorderedArray.map(str => Number(str.split(",")[0]))

  stepList.value[index].nested.forEach((nestedStep, nestedIndex) => {
    nestedStep.index = formatedReorderedArray.indexOf(nestedIndex)
  })
}

const _reorderTheListMainFromHTML = (promise: Promise<any>) => {
  promise.then(() => {
    let count = 0
    for (const child of mainStepList.value.children) {
      const elementId = child.dataset.value
      const findIndex = stepList.value.findIndex(element => element.id === parseInt(elementId))

      stepList.value[findIndex].index = count
      count++
    }
  })
}
const _reorderTheListNestedFromHTML = (promise: Promise<any>, index: number) => {
  promise.then(() => {
    let count = 0
    for (const child of nestedStepLists.value[index].children) {
      const elementId = child.dataset.value
      const findIndex = stepList.value[index].nested.findIndex(element => element.id === parseInt(elementId))

      stepList.value[index].nested[findIndex].index = count
      count++
    }
  })
}

let mainSortableList: any

onMounted(() => {
  // Init sortable lists
  mainSortableList = new Sortable(mainStepList.value, {
    animation: 150,
    dataIdAttr: "data-value",
    handle: ".drag-element",
    onUpdate: function () {
      editEachIndexInStepList(this.toArray())
    }
  })
})
</script>

<style scoped>
</style>
