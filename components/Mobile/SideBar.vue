<template>
    <aside
        class="transform fixed top-0 left-0 w-64 bg-light  h-full overflow-auto ease-in-out transition-all duration-300 z-30"
        :class="pageStore.isSideBarOpen ? 'translate-x-0' : '-translate-x-full'">
            <MobileSideBarContent/>
    </aside>
    <div class="overlay absolute bg-dark opacity-50 w-screen h-screen -z-01" v-if="pageStore.isSideBarOpen" @click="useToggleSideBar"></div>
</template>

<script setup lang="ts">
    import { usePageStore } from '../../stores/pageStore'
    const pageStore = usePageStore()
</script>