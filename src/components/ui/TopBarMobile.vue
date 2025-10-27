<template>
    <div class="fixed p-4 top-0 left-0 right-0 z-10 h-20 flex justify-between items-center bg-card-light dark:bg-card-dark">
        <div class="flex items-center justify-center gap-3">
            <div class="relative">
                <!-- Circular Progress -->
                <svg class="w-12 h-12" viewBox="0 0 100 100">
                    <circle class="text-gray-700" stroke-width="10" stroke="currentColor" fill="transparent" :r="radius"
                        cx="50" cy="50" />
                    <circle class="text-blue-500 transition-all duration-100 ease-linear" stroke-width="10"
                        stroke-dasharray="283" :stroke-dashoffset="offset" stroke-linecap="round" stroke="currentColor"
                        fill="transparent" :r="radius" cx="50" cy="50" />
                </svg>

                <!-- Text Info (centered inside circle) -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <p class="text-gray-700 dark:text-gray-200 text-[10px] font-bold">{{ progress }}</p>
                    <p class="text-gray-400 dark:text-gray-600 text-[7px]">Days left</p>
                </div>
            </div>

            <!-- Bottom Info -->
            <div class="">
                <p class="text-gray-600 font-medium text-sm">Package 1</p>
                <p class="text-blue-500 text-xs">Next billing on May 1, 2025</p>
            </div>
        </div>

        <div class="relative">
            <IconBell />
            <span class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const progress = ref(0)
const target = 85

const radius = 45
const circumference = 2 * Math.PI * radius
const offset = computed(() => circumference - (progress.value / 100) * circumference)

onMounted(() => {
    let current = 0
    const step = () => {
        if (current < target) {
            current++
            progress.value = current
            requestAnimationFrame(step)
        }
    }
    requestAnimationFrame(step)
})
</script>