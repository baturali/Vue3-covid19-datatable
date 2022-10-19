<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { SummaryDTO, SummaryCountriesDTO, TableOptions } from '../services/types'
import TablePagination from '@/components/TablePagination.vue'

export interface DataTableProps {
  summary?: SummaryDTO
  input?: string
}
const dataTableProps = defineProps<DataTableProps>()

const countries = ref<SummaryCountriesDTO[]>()
const inputValue = ref<string>()

watch(dataTableProps, (newVal, oldVal) => {
  if (newVal) { 
    countries.value = dataTableProps.summary?.Countries
    inputValue.value = dataTableProps.input
  }
}, { immediate: true })

const pageDataHandler = computed(() => {
  if (!countries.value) return []
  const { input } = dataTableProps
  const { page, rowCount } = tableOptions
  return countries.value
    .filter((country: SummaryCountriesDTO) => input ? country.Country.toLowerCase().includes(input.toLowerCase()) : country)
    .slice(input ? 0 : page * rowCount, input ? countries.value.length : (page + 1) * rowCount)
})

const tableOptions = reactive<TableOptions>({
  page: 0,
  rowCount: 20,
  headers: ['Country', 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered']
})


function translatedLabel(label: string) {
  return label.replace(/([A-Z][a-z])/g,' $1').replace(/(\d)/g,' $1');
}

function getColumnSum(key: 'TotalConfirmed' | 'TotalDeaths' | 'TotalRecovered') {
  return pageDataHandler.value
    .map((row: SummaryCountriesDTO) => {
      return row[key]
    })
    .reduce((a: number, b: number) => a + b, 0)
}

function formatNumbers(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function changePage(sign: boolean) {
  sign ? tableOptions.page++ : tableOptions.page--
}
</script>

<template>
  <table> 
    <thead>
      <tr>
        <td v-for="header in tableOptions.headers" :key="header" :data-test="header">
          {{ translatedLabel(header) }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in pageDataHandler" :key="row.Slug" data-test="data-row">
        <td>{{ row.Country }}</td>
        <td :data-test="index === 0 ? 'first-confirmed' : 'confirmed'">
          {{ formatNumbers(row.TotalConfirmed) }}
        </td>
        <td>{{ formatNumbers(row.TotalDeaths) }}</td>
        <td>{{ formatNumbers(row.TotalRecovered) }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="text-right"> Total: </td>
        <td data-test="total-confirmed">{{ formatNumbers(getColumnSum('TotalConfirmed')) }}</td>
        <td data-test="total-deaths">{{ formatNumbers(getColumnSum('TotalDeaths')) }}</td>
        <td data-test="total-recovered">{{ formatNumbers(getColumnSum('TotalRecovered')) }}</td>
      </tr>
    </tfoot>
  </table>
  <TablePagination
    :table-options="tableOptions"
    :total-count="countries ? countries.length : 0"
    :input-value="inputValue"
    @change-page="changePage"
  />
</template>

<style lang="postcss" scoped>
table {
  @apply w-full bg-white rounded-sm overflow-hidden;

  & tr > td {
    @apply px-4 py-2 w-1/4 text-black;
  }

  & thead > tr > td {
    @apply text-black text-xl border-b border-b-gray-400 pt-6 font-extrabold;
  }

  & tbody > tr:nth-child(odd) > td {
    @apply bg-gray-200;
  }

  & tfoot > tr > td {
    @apply bg-gray-700 font-extrabold text-white;
  }
}
</style>