export interface SummaryDTO {
  Global: SummaryGlobalDTO
  Countries: SummaryCountriesDTO[]
  ID: string
  Message: string
}

export interface SummaryGlobalDTO {
  NewConfirmed: number
  NewDeaths: number
  NewRecovered: number
  TotalConfirmed: number
  TotalDeaths: number
  TotalRecovered: number
  Date: string
}

export interface SummaryCountriesDTO extends SummaryGlobalDTO {
  Country: string
  CountryCode: string,
  Slug: string,
  ID: string
}

export interface DataTableProps {
  summary?: SummaryDTO
  input?: string
}

export interface TableOptions {
  page: number
  rowCount: number
  headers: string[]
}