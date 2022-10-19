<script setup lang="ts">
import { computed } from 'vue'
import type { TableOptions } from '../services/types'

export interface PaginationProps {
  tableOptions: TableOptions
  totalCount: number
  inputValue?: string
}
const paginationProps = defineProps<PaginationProps>()

const emitEvent = defineEmits<{
  (e: 'change-page', sign: boolean): void
}>()

const rowCount = computed(() => {
  return paginationProps.tableOptions.rowCount
})
const totalCount = computed(() => {
  return paginationProps.totalCount
})
const page = computed(() => {
  return paginationProps.tableOptions.page
})
const firstIndexOfPage = computed(() => {
  return page.value * rowCount.value
})
const inputValue = computed(() => {
  return paginationProps.inputValue
})
</script>

<template>
  <footer>
    <div class="filter" v-if="inputValue">
      Showing filtered results for <span class="input-value">"{{ inputValue }}"</span>
    </div>
    <div class="pagination" v-else>
      <div>
        Showing
        {{ firstIndexOfPage }} - 
        {{ totalCount < firstIndexOfPage + rowCount ? totalCount : firstIndexOfPage + rowCount}}
        of {{ totalCount < rowCount ? rowCount : totalCount }}
      </div>
      <div class="actions">
        <button
          :class="{ 'disabled': !page }"
          @click="page && emitEvent('change-page', false)"
        >
          Previous
        </button>
        <span class="page-indicator">Page: {{ page + 1}}</span>
        <button
          :class="{ 'disabled': !(((page + 1) * rowCount) < totalCount) }"
          @click="(((page + 1) * rowCount) < totalCount) && emitEvent('change-page', true)"
        >
          Next
        </button>
      </div>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
footer {
  @apply w-full pt-4;
}

.filter {
  @apply text-white text-lg font-bold text-center w-full;

  & .input-value {
    @apply text-purple-700;
  }
}

.pagination {
  @apply flex flex-row w-full items-center justify-between;

  & .actions {
    @apply flex items-center gap-x-6;

    & .page-indicator {
      @apply text-lg text-white font-bold;
    }
  }

  button {
    @apply bg-purple-500 rounded-xl py-2 px-3 transition-all text-white;

    &:hover {
      @apply bg-purple-700;
    }
  }
  button.disabled {
    @apply bg-gray-400 cursor-not-allowed;
  }
}
</style>