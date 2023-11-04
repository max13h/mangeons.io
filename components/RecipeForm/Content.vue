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
            tabindex="-1"
          />
          <i class="ri-settings-3-line text-2xl me-4" @click="showOptions(index)" />
          <Teleport v-if="(modalStore.whatIsOpen == 'recipeStepSetting') && (optionIndex == index)" to="#modal">
            <div class="flex flex-col justify-center h-full w-full">
              <button
                type="button"
                class="btn-secondary"
                @click="addNestedStep(index)"
              >
                Ajouter une sous-étape
              </button>
              <button type="button" class="btn-outline-secondary mt-4" @click="removeStep(index)">
                Supprimer l'étape
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
              tabindex="-1"
            />
            <i class="ri-delete-bin-line text-xl me-4" @click="removeNestedStep(nestedIndex, index)" />
            <i class="ri-draggable text-2xl drag-nested-element" />
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="errorMessage"
      class="text-red-500 text-sm"
    >
      {{ useCapitalize(errorMessage) }}
    </span>
    <button class="btn-secondary w-full mt-4 mb-8" tabindex="-1" @click="addStep">
      Ajouter une étape
    </button>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"

const { value, errorMessage } = useField(() => "content")

const modalStore = useModalStore()

const mainStepList: globalThis.Ref<any> = ref(null)
const nestedStepLists: globalThis.Ref<any[]> = ref([])
const inputElements = ref([])

const props = defineProps<{
  content?: StepsList[]
}>()

const stepList: globalThis.Ref<StepsList[]> = ref([
  {
    id: 0,
    value: "",
    nested: [],
    index: 0
  }
])

if (props.content) {
  stepList.value = props.content
}

const optionIndex: globalThis.Ref<number> = ref(0)
const showOptions = (index: number) => {
  useOpenModal("recipeStepSetting")
  optionIndex.value = index
}

const addStep = () => {
  const promise = new Promise((resolve, _reject) => {
    let highestId = -1
    if (stepList.value.length > 0) {
      highestId = Math.max(...stepList.value.map(obj => obj.id))
    }
    if (stepList.value.push({
      id: highestId + 1,
      value: "",
      nested: [],
      index: stepList.value.length
    })) {
      resolve(true)
    } else {
      throw new Error("error")
    }
  })
  _reorderTheMainListFromHTML(promise)
}
const addNestedStep = (index: number) => {
  let highestId = -1
  if (stepList.value[index].nested.length > 0) {
    highestId = Math.max(...stepList.value[index].nested.map(obj => obj.id))
  }
  const promise = new Promise((resolve, _reject) => {
    resolve(stepList.value[index].nested.push({
      id: highestId + 1,
      value: "",
      index: stepList.value[index].nested.length
    }))
  })
  _reorderTheNestedListFromHTML(promise, index)

  setTimeout(() => {
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
  }, 300)

  modalStore.close()
}

const removeStep = (index: number) => {
  const promise = new Promise((resolve, _reject) => {
    if (stepList.value.splice(index, 1)) {
      resolve(true)
    } else {
      throw new Error("error")
    }
  })

  _reorderTheMainListFromHTML(promise)
  modalStore.close()
}
const removeNestedStep = (nestedIndex: number, index: number) => {
  const promise = new Promise((resolve, _reject) => {
    if (stepList.value[index].nested.splice(nestedIndex, 1)) {
      resolve(true)
    } else {
      throw new Error("error")
    }
  })

  _reorderTheNestedListFromHTML(promise, index)
  modalStore.close()
}

const editEachIndexInStepList = (reorderedArray: string[]) => {
  stepList.value.forEach((step) => {
    step.index = reorderedArray.indexOf(step.id.toString())
  })
}
const editEachIndexInNestedStepList = (reorderedArray: string[], index: number) => {
  stepList.value[index].nested.forEach((nestedStep) => {
    nestedStep.index = reorderedArray.indexOf(nestedStep.id.toString())
  })
}

const _reorderTheMainListFromHTML = (promise: Promise<any>) => {
  promise.then(() => {
    let count = 0
    if (mainStepList.value) {
      for (const child of mainStepList.value.children) {
        const elementId = child.dataset.value
        const findIndex = stepList.value.findIndex(element => element.id === parseInt(elementId))

        stepList.value[findIndex].index = count
        count++
      }
    }
  })
}
const _reorderTheNestedListFromHTML = (promise: Promise<any>, index: number) => {
  promise.then(() => {
    let count = 0
    if (nestedStepLists.value[index]) {
      for (const child of nestedStepLists.value[index].children) {
        const elementId = child.dataset.value
        const findIndex = stepList.value[index].nested.findIndex(element => element.id === parseInt(elementId))

        stepList.value[index].nested[findIndex].index = count
        count++
      }
    }
  })
}

watch(stepList.value, () => {
  let finalString = ""

  const cloned = [...stepList.value]
  cloned.sort((a, b) => a.index - b.index)

  cloned.forEach((element, index) => {
    finalString = finalString + `${index + 1}. ` + element.value
    if (element.nested.length > 0) {
      const nestedCloned = [...element.nested]
      nestedCloned.sort((a, b) => a.index - b.index)

      nestedCloned.forEach((nestedElement, nestedIndex) => {
        finalString = finalString + "\n\t" + `${nestedIndex + 1}. ` + nestedElement.value
      })
    }
    finalString = finalString + "\n"
  })
  // emit("updateContent", finalString)
  value.value = finalString
})

onMounted(() => {
  // Init sortable lists
  const mainSortableList = new Sortable(mainStepList.value, {
    animation: 150,
    swapThreshold: 0.5,
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
