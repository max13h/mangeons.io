<template>
  <div class="h-full overflow-y-scroll overflow-x-hidden">
    <div class="flex items-center text-xl mb-4 min-h-[56px]">
      <p class=" font-light">
        Décrivrez <span class="font-light underline">étape</span> par <span class="font-light underline">étape</span> comment réussir votre recette
        <Tooltip position="bottom" class="w-fit inline">
          <p class="text-base">
            Vous pouvez <strong>redimensionner</strong> les boites de dialogues afin de mieux voir ce que vous écrivez. Selectionnez le <strong>bas droit</strong> de la case pour étendre
          </p>
        </Tooltip>
        🔪
      </p>
    </div>

    <div ref="mainStepList" class="overflow-hidden">
      <div
        v-for="(step, index) in stepList"
        :key="index"
        :data-value="step.id"
        class="rounded-2xl bg-slate-200 px-2 mb-2 flex flex-col"
      >
        <div class="flex items-center mb-1">
          <p>
            {{ step.index + 1 }}.
          </p>
          <textarea
            ref="inputElements"
            v-model="step.value"
            :name="`step-${index}`"
            type="text"
            class="m-2"
          />
          <Icon name="fluent:more-circle-16-regular" size="2rem" class="cursor-pointer" @click="showOptions(index)" />
          <Teleport v-if="(modalStore.whatIsOpen === 'recipeStepSetting') && (optionIndex === index)" to="#modal">
            <div class="flex flex-col justify-center h-full w-full">
              <button
                type="button"
                class="btn-primary"
                @click="addNestedStep(index)"
              >
                Ajouter une sous-étape
              </button>
              <button type="button" class="btn-outline-primary mt-4" @click="removeStep(index)">
                Supprimer l'étape
              </button>
            </div>
          </Teleport>
          <Icon name="fluent:re-order-dots-vertical-16-regular" size="2.5rem" class="drag-element cursor-grab active:cursor-grabbing" />
        </div>
        <div v-if="step.nested.length !== 0" ref="nestedStepLists">
          <div
            v-for="(nestedStep, nestedIndex) in stepList[index].nested"
            :key="nestedIndex"
            class="flex items-center rounded-2xl bg-slate-100 mb-2 px-2"
            :data-value="nestedStep.id"
          >
            <p class="text-sm">
              {{ nestedStep.index + 1 }}.
            </p>
            <textarea
              ref="inputElements"
              v-model="stepList[index].nested[nestedIndex].value"
              :name="`step-${index}` + `${nestedIndex}`"
              type="text"
              class="m-2"
            />
            <Icon name="fluent:more-circle-16-regular" size="2rem" class="cursor-pointer" @click="showNestedOptions(`${index}` + `${nestedIndex}`)" />
            <Teleport
              v-if="(modalStore.whatIsOpen === 'recipeNestedStepSetting') && (optionNestedIndex === `${index}` + `${nestedIndex}`)"
              to="#modal"
              class="bg-red-300"
            >
              <button type="button" class="btn-ghost-primary w-full" @click="removeNestedStep(nestedIndex, index)">
                Supprimer la sous étape
              </button>
            </Teleport>
            <Icon name="fluent:re-order-dots-vertical-16-regular" size="2.5rem" class="drag-nested-element cursor-grab active:cursor-grabbing" />
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="errorMessage"
      class="text-red-500 text-sm"
    >
      {{ capitalize(errorMessage) }}
    </span>
    <button class="btn-outline-primary w-full mt-4 mb-8" @click="addStep">
      Ajouter une étape
      <Icon name="fluent:add-circle-16-regular" size="2rem" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Sortable from "sortablejs"

const modalStore = useModalStore()

const { value, errorMessage } = useField(() => "content")

const mainStepList: globalThis.Ref<any> = ref(null)
const nestedStepLists: globalThis.Ref<any[]> = ref([])
const inputElements = ref([])

const props = defineProps<{
  content?: string
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
  value.value = props.content
  stepList.value = useParseStringToStepListObject(props.content)
}

const optionIndex: globalThis.Ref<number> = ref(0)
const showOptions = (index: number) => {
  useOpenModal("recipeStepSetting")
  optionIndex.value = index
}
const optionNestedIndex: globalThis.Ref<string> = ref("")
const showNestedOptions = (nestedIndex: string) => {
  useOpenModal("recipeNestedStepSetting")
  optionNestedIndex.value = nestedIndex
}

const addStep = () => {
  const promise = new Promise((resolve) => {
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
