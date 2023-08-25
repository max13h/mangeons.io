<template>
    <div class="h-screen flex flex-col">
        <LayoutHeader/>
        <div class="grow overflow-y-scroll">
            <slot/>
        </div>
        <LayoutNavbar/>
    </div>

</template>