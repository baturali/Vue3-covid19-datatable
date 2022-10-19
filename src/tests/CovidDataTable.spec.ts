import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CovidDataTable from '@/components/CovidDataTable.vue'
import type { SummaryDTO } from '../services/types'
import TablePagination from '@/components/TablePagination.vue'

const defaultMountOptions: { props: {
  summary?: SummaryDTO
  input?: string
} } = {
  props: {
    summary: {
      Countries: [
        {
          Country: 'Test country',
          CountryCode: 'Some code',
          Date: 'Today',
          ID: 'iftbbg3241vtvb',
          NewConfirmed: 64,
          NewDeaths: 0,
          NewRecovered: 0,
          Slug: 'test-country',
          TotalConfirmed: 201276,
          TotalDeaths: 7311,
          TotalRecovered: 1
        },
        {
          Country: 'A real country',
          CountryCode: 'Some code',
          Date: 'Today',
          ID: 'iftbbg3241vtvb',
          NewConfirmed: 64,
          NewDeaths: 0,
          NewRecovered: 0,
          Slug: 'a-real-country',
          TotalConfirmed: 1322,
          TotalDeaths: 9,
          TotalRecovered: 1313
        }
      ],
      Global: {
        Date: "2022-10-19T05:34:04.363Z",
        NewConfirmed: 533718,
        NewDeaths: 1706,
        NewRecovered: 0,
        TotalConfirmed: 623745794,
        TotalDeaths: 6563578,
        TotalRecovered: 0
      },
      ID: 'test-id',
      Message: ''
    },
    input: ''
  }
}

describe('CovidDataTable', () => {
  it('Renders properly', () => {
    const wrapper = mount(CovidDataTable)
    expect(wrapper.find('table')).toMatchSnapshot()
  })

  it('Should have the translated header values', () => {
    const wrapper = mount(CovidDataTable)
    const headers = [
      ['TotalConfirmed', 'Total Confirmed'],
      ['TotalDeaths', 'Total Deaths'],
      ['TotalRecovered', 'Total Recovered']
    ]
    headers.forEach(([header, translated]) => {
      expect(wrapper.find(`[data-test=${header}]`).text()).toBe(translated)
    })
  })

  it('Shows prepared rows with given props', () => {
    const wrapper = mount(CovidDataTable, defaultMountOptions)
    expect(wrapper.find('[data-test=data-row]')).toBeTruthy()
    expect(wrapper.findAll('[data-test=data-row]').length).toBe(2)
  })

  it('Displays accumulated "total" values', () => {
    const wrapper = mount(CovidDataTable, defaultMountOptions)
    const totalColumns = ['total-confirmed', 'total-deaths', 'total-recovered']
    totalColumns.forEach((column) => {
      expect(wrapper.find(`[data-test=${column}]`).text()).toBeTruthy()
    })
  })

  it('Filters the table list and returns matched row via user input', async () => {
    const wrapper = mount(CovidDataTable, defaultMountOptions)
    wrapper.setProps({
      input: 'Test '
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('[data-test=data-row]').length).toBe(1)
  })

  it('Should change the page via Previous and Next buttons', async () => {
    const wrapper = mount(CovidDataTable, defaultMountOptions)
    const totalConfirmed = wrapper.find('[data-test=total-confirmed]').text()
    const children = wrapper.findComponent(TablePagination)
    children.vm.$emit('change-page', true)
    await wrapper.vm.$nextTick()
    const updatedTotalConfirmed = wrapper.find('[data-test=total-confirmed]').text()
    expect(totalConfirmed === updatedTotalConfirmed).toBe(false)
  })

  it('Should format numbers', () => {
    const wrapper = mount(CovidDataTable, defaultMountOptions)
    const totalConfirmed = wrapper.find('[data-test=first-confirmed]').text()
    expect(totalConfirmed !== defaultMountOptions.props.summary?.Countries[0].TotalDeaths.toString()).toBe(true)
  })
})
