<script setup lang="ts">
import { ref, watch } from 'vue'

const inputModel = ref<string>()

const emitValue = defineEmits<{
  (e: 'value-change', value?: string): void
}>()
watch(inputModel, (newValue) => {
  emitValue('value-change', newValue)
})
</script>

<template>
  <div class="input-wrapper">
    <input v-model="inputModel" placeholder="Filter for countries..." type="text"/>
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.input-wrapper {
  @apply w-1/2 pb-8;

  .icon {
    @apply absolute right-2 top-1 w-6 h-6 text-black z-10;
  }
}
input {
  @apply rounded-lg px-2 py-1 text-black w-full;
}
</style>