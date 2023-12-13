<template>
  <div>
    <Teleport v-if="useIsModalOpen('confirmeRecipeImageChange')" to="#modal">
      <p>Confirmez le changement d'image:</p>
      <p v-if="uploadedFile" class="font-bold w-full text-center mt-4">
        {{ uploadedFile.name }}
      </p>
      <div class="w-full flex justify-center">
        <div v-if="tempURL" class="w-[200px] h-[220px] overflow-hidden">
          <NuxtImg
            :src="tempURL"
            alt="Image you just uploaded"
            width="100px"
            class="object-cover w-full h-full"
            placeholder
          />
        </div>
      </div>
      <button type="button" class="btn-primary w-full mt-4" @click="handleConfirmImageUpload">
        Confirmer
      </button>
      <button type="button" class="btn-outline-primary w-full mt-4" @click="handleCancelImageUpload">
        Annuler
      </button>
    </Teleport>

    <div v-if="props.recipeData.image_url" class="image-card">
      <NuxtImg :src="props.recipeData.image_url" :alt="`Recipe image for ${props.recipeData.name}`" class="w-full h-full object-cover  z-0" sizes="144px sm:176px md:768px" />
      <label v-if="publicUser?.id === props.recipeData.author.id" for="recipe-image" class="absolute bottom-0 right-0 w-8 h-8 z-10 overflow-hidden cursor-pointer">
        <Icon name="fluent:image-edit-16-regular" class="absolute absolute-center z-10 drop-shadow-icon cursor-pointer" size="1.5rem" />
        <input type="file" accept="image/*" name="recipe-image" class="border-none opacity-0 w-full h-full cursor-pointer absolute absolute-center z-10" @change="handleChangeRecipeImage">
      </label>
    </div>
    <div v-else class="image-card">
      <NuxtImg src="/default/recipe.png" alt="default recipe image" class="w-full h-full object-cover z-0" sizes="144px sm:176px md:768px" />
      <span v-if="publicUser?.id === props.recipeData.author.id" class="absolute absolute-center w-full h-full bg-gradient-to-b from-transparent to-slate-500 z-10 " />
      <Icon v-if="publicUser?.id === props.recipeData.author.id" name="fluent:image-add-20-regular" class="absolute absolute-center text-white z-10" size="3rem" />
      <label v-if="publicUser?.id === props.recipeData.author.id" for="recipe-image" class="absolute absolute-center z-10 w-full h-full">
        <input type="file" accept="image/*" name="recipe-image" class="border-none opacity-0 w-full h-full cursor-pointer" @change="handleChangeRecipeImage">
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const modalStore = useModalStore()
const uploadedFile: any = ref(undefined)
const tempURL: globalThis.Ref<string> = ref("")
const route = useRoute()
const props = defineProps<{
  recipeData: any;
}>()

const publicUser = await useGetPublicUser()

const handleChangeRecipeImage = (event: any) => {
  const file = event.target.files[0]
  if (!file) {
    return false
  }

  uploadedFile.value = file
  tempURL.value = URL.createObjectURL(file)

  useOpenModal("confirmeRecipeImageChange")
}
const handleCancelImageUpload = () => {
  modalStore.close()
  uploadedFile.value = undefined
  tempURL.value = ""
}
const handleConfirmImageUpload = () => {
  useUploadRecipeImage(route.params.id, uploadedFile.value, props.recipeData.image_url)
}
</script>

<style scoped>
.drop-shadow-icon {
  filter: drop-shadow(1px 1px 10px rgb(0, 0, 0));
  @apply text-white
}

.image-card {
  @apply relative overflow-hidden h-36 sm:h-44 mb-4 w-full rounded-2xl bg-white shadow-md
}
</style>
