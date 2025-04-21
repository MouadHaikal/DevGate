<template>
    <transition name="slide-fade">
        <div class="absolute top-32 right-8 flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-gray-400 bg-gray-900 transition-all 
            duration-150 ease-in-out border border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:text-gray-300"
            v-if="isActive" role="alert">

            <div :class="['inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg', currentConfig.color]">

                <svg class="size-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" v-html="currentConfig.icon">
                </svg>

            </div>

            <div class="ms-3 font-bold select-none">
                {{ message }}
            </div>

            <button class="size-8 cursor-pointer ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 
                p-1.5 inline-flex items-center justify-center text-gray-500 hover:text-white bg-gray-900 hover:bg-gray-800"
                @click.prevent="isActive=false">

                <svg class="size-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>

            </button>

        </div>
    </transition>
</template>

<script setup>
    import { computed } from 'vue';

    import { useNotification } from '../composables/useNotification';

    const { isActive, message, type } = useNotification();

    const typeConfig = {
        success: {
            color: 'bg-green-800 text-green-200',
            icon: `<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>`
        },
        error: {
            color: 'bg-red-800 text-red-200',
            icon: `<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/> `
        },
        info: {
            color: 'bg-orange-700 text-orange-200',
            icon: `<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>`
        }
    };

    const currentConfig = computed(() => typeConfig[type.value] || typeConfig.info);
</script>
