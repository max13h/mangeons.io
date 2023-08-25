<template>
    <header class="sticky top-0 bg-light flex border-b-2 border-dark w-full h-16">
        <img src="@/assets/logos/LITTLE LIGHT LOGO.svg" alt="mangeons.io logo" class="absolute top-1/2 -translate-y-1/2 left-1 w-16">
        <h1 class="text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{{ pageTitle }}</h1>
    </header>
</template>

<script setup>
    const router = useRouter()
    const pageTitleRaw = router.currentRoute.value.name
    const pageTitle = pageTitleRaw[0].toUpperCase() + pageTitleRaw.substring(1);
</script>