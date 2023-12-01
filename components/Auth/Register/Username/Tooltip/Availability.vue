<template>
  <div>
    <TooltipContainer v-if="props.hasFetchForUsername && !props.isUsernameUnique" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
      <Icon name="fluent:dismiss-circle-16-filled" size="1.5rem" class="text-red-500 " />
      <template #tooltip>
        <p>Le nom d'utilisateur est déjà utilisé</p>
      </template>
    </TooltipContainer>
    <TooltipContainer v-else-if="props.hasFetchForUsername && props.isUsernameUnique" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
      <Icon name="fluent:checkmark-circle-16-filled" size="1.5rem" class="text-green-500" />
      <template #tooltip>
        <p>Le nom d'utilisateur est disponible</p>
      </template>
    </TooltipContainer>
    <TooltipContainer v-else-if="props.isFetchingForUsername && !props.hasFetchForUsername" position="left" class="absolute right-2 top-1/2 -translate-y-1/2" tooltip-class="min-w-[12rem]">
      <Icon name="svg-spinners:ring-resize" size="1.2rem" class="text-primary" />
      <template #tooltip>
        <p>Nous recherchons la disponibilité du nom d'utilisateur</p>
      </template>
    </TooltipContainer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hasFetchForUsername: boolean;
  isUsernameUnique: boolean | null;
  isFetchingForUsername: boolean;
}>()
</script>
