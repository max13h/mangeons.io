<template>
  <div>
    <Teleport v-if="modalStore.whatIsOpen == 'confirmeRecipeImageChange'" to="#modal">
      <p>Confirmez le changement d'image:</p>
      <p v-if="uploadedFile" class="font-bold w-full text-center mt-4">
        {{ uploadedFile.name }}
      </p>
      <button type="button" class="btn-secondary w-full mt-4" @click="handleConfirmImageUpload">
        Confirmer
      </button>
      <button type="button" class="btn-outline-secondary w-full mt-4" @click="handleCancelImageUpload">
        Annuler
      </button>
    </Teleport>
    <div class="relative overflow-hidden rounded-xl w-full h-32 mb-4 border-2 bg-slate-200">
      <div v-if="props.imageUrl">
        <NuxtImg :src="props.imageUrl" alt="recipe image" quality="0" fit="contain" class="absolute absolute-center" />
        <label for="recipe-image" class="absolute bottom-0 right-0 w-8 h-8 z-10">
          <input type="file" accept="image/*" name="recipe-image" class="border-none opacity-0 w-full h-full cursor-pointer absolute absolute-center z-50" @change="handleChangeRecipeImage">
          <i class="ri-image-edit-line text-2xl absolute absolute-center z-10" />
          <span class="absolute bg-gradient-to-b from-transparent to-white w-full h-full blur-sm" />
        </label>
      </div>
      <div v-else>
        <i class="ri-image-add-line absolute absolute-center text-4xl text-white z-50" />
        <span class="absolute bg-gradient-to-b from-transparent to-slate-600 w-full h-full translate-y-8 z-10 " />
        <label for="recipe-image" class="absolute absolute-center text-4xl z-10 w-full h-full  ">
          <input type="file" accept="image/*" name="recipe-image" class="border-none opacity-0 w-full h-full cursor-pointer" @change="handleChangeRecipeImage">
        </label>
        <NuxtImg src="/default/recipe.png" alt="default recipe image" class="rounded-xl w-full h-full object-cover max-h-32" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const modalStore = useModalStore()
const uploadedFile = ref(undefined)
const route = useRoute()

const props = defineProps<{
  imageUrl: string
}>()

const handleChangeRecipeImage = (event) => {
  const file = event.target.files[0]
  if (!file) {
    return false
  }
  uploadedFile.value = file

  useOpenModal("confirmeRecipeImageChange")
}
const handleCancelImageUpload = () => {
  modalStore.close()
  uploadedFile.value = undefined
}
const handleConfirmImageUpload = async () => {
  modalStore.close()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  if (user.value) {
    const { data, error } = await supabase.storage
      .from("recipes")
      .upload(`${user.value.id}/${route.params.id}`, uploadedFile.value, {
        upsert: true
      })
    console.log("data", data)
    console.log("error", error)
  }
}
</script>

<style scoped>

</style>
