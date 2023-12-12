<template>
  <NuxtLink :to="`/app/recettes/${recipe.id}`" class="card p-0 flex w-full">
    <div class="w-[100px] h-[110px] min-w-[66px] rounded-l-xl overflow-hidden">
      <NuxtImg
        :src="props.recipe.image_url || '/default/recipe.png'"
        :alt="props.recipe.image_url ? `Recipe image for ${props.recipe.name}` : 'Default recipe image'"
        width="100px"
        class="object-cover w-full h-full"
        placeholder
      />
    </div>
    <div class="p-4 flex-grow overflow-hidden">
      <p class="text-lg truncate w-full">
        {{ capitalize(props.recipe.name) }}
      </p>
      <p class="text-sm truncate italic">
        {{ capitalize(props.recipe.description) }}
      </p>
      <div class="flex justify-between mt-2 max-w-[16rem]">
        <p v-if="props.showIsPublic" class="text-xs">
          <Icon
            :name="props.recipe.is_public ? 'fluent:checkmark-circle-16-regular' : 'fluent:lock-closed-16-regular'"
            :class="[ props.recipe.is_public ? 'text-green-500' : 'text-black' ]"
            size="1rem"
          />
          {{ props.recipe.is_public ? "Publié" : "Privé" }}
        </p>
        <p class="text-xs">
          <Icon name="fluent:tag-16-regular" size="1rem" />
          {{ props.recipe.meal_category_id.name_fr }}
        </p>
        <p class="text-xs truncate">
          <Icon name="fluent:clock-16-regular" size="1rem" />
          {{ props.recipe.cooking_time }} min
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  recipe: any;
  showIsPublic: boolean
}>()
</script>

<style scoped>
</style>
