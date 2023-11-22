<template>
  <div>
    <Teleport v-if="modalStore.whatIsOpen == 'confirmeRecipeImageChange'" to="#modal">
      <p>Confirmez le changement d'image:</p>
      <p v-if="uploadedFile" class="font-bold w-full text-center mt-4">
        {{ uploadedFile.name }}
      </p>
      <NuxtImg v-if="tempURL" :src="tempURL" />
      <button type="button" class="btn-primary w-full mt-4" @click="handleConfirmImageUpload">
        Confirmer
      </button>
      <button type="button" class="btn-outline-primary w-full mt-4" @click="handleCancelImageUpload">
        Annuler
      </button>
    </Teleport>

    <div class="relative overflow-hidden rounded-xl w-full h-32 mb-4 border-2 bg-slate-200">
      <div v-if="imageUrl">
        <NuxtImg :src="imageUrl" alt="recipe image" class="absolute absolute-center object-cover w-full h-full" />
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
const uploadedFile: any = ref(undefined)
const tempURL: globalThis.Ref<string> = ref("")
const route = useRoute()
const props = defineProps<{
  imageUrl: string
}>()
const imageUrl: globalThis.Ref<string> = ref(props.imageUrl)

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
const handleConfirmImageUpload = async () => {
  modalStore.close()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  if (user.value) {
    const { error: uploadError } = await supabase.storage
      .from("recipes")
      .upload(`${user.value.id}/${route.params.id}`, uploadedFile.value, {
        upsert: true
      })

    if (uploadError) {
      throw new Error("Error on upload image")
    }

    const { data: publicUrlData } = await supabase.storage
      .from("recipes")
      .getPublicUrl(`${user.value.id}/${route.params.id}`)

    imageUrl.value = tempURL.value

    const { error: insertError } = await supabase
      .from("recipes")
      .update({ image_url: publicUrlData.publicUrl })
      .eq("id", route.params.id)

    if (insertError) {
      throw new Error("Error on upsert new public url")
    }
  }
}
</script>

<style scoped>

</style>
