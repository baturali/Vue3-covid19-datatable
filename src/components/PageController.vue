<script setup lang="ts">
import CovidDataTable from './CovidDataTable.vue'
import InputField from './InputField.vue'
import { ref, onBeforeMount } from 'vue'
import ApiLayer from '../services/api'
import type { SummaryDTO } from '../services/types'

const summary = ref<SummaryDTO>()

onBeforeMount(async () => {
  try {
    const { data } = await ApiLayer.getSummary()
    const storedValue = localStorage.getItem('summary')
    if (data.Message === "Caching in progress" && storedValue) {
      const storageData: SummaryDTO = JSON.parse(storedValue)
      summary.value = storageData
    } else {
      localStorage.setItem('summary', JSON.stringify(data))
      summary.value = data
    }
  } catch(error) {
    console.error(error)
  }
})

const inputValue = ref<string>()
const onValueChange = (value?: string) => {
  inputValue.value = value
}
</script>

<template>
  <main class="wrapper">
    <h2>COVID-19 data</h2>
    <InputField @value-change="onValueChange"/>
    <CovidDataTable :summary="summary" :input="inputValue" />
  </main>
</template>

<style lang="postcss" scoped>
.wrapper {
  @apply flex flex-col items-center p-10 pt-4;

  & h2 {
    @apply font-semibold text-xl text-purple-600 pb-6;
  }
}
</style>