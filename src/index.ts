// Lookups
export {
  getCountry,
  getCountryByAlpha2,
  getCountryByAlpha3,
  getCountryByNumericCode,
  getCountryByName,
  getCountryByCapital,
  getCountryByTLD,
  getPhoneCode,
  getCurrencyInfo,
  isValidCountryCode,
} from "./core/lookup";

// Search
export { searchCountries, searchCountry } from "./core/search";

// Filters & Groupings
export {
  getCountriesByRegion,
  getCountriesByContinent,
  getCountriesBySubregion,
  getCountriesByLanguage,
  getCountriesByCurrency,
  getCountriesByCallingCode,
  getCountriesByGrouping,
  getCountriesByStartOfWeek,
  getCountriesByDrivingSide,
  getCountriesByTimezone,
  getCountryByPhoneCode,
  getGroupings,
  getAvailableGroupings,
  filterCountries,
  getAllCountries,
  getNeighbors,
} from "./core/filters";

// Utilities
export {
  toEmojiFlag,
  getDistance,
  getRandomCountry,
  getRandomCountries,
  getCountriesByPopulation,
  getCountriesByArea,
  getCountriesByBorderCount,
  getCountriesByHemisphere,
  toCountryCode,
  getCountryStats,
  sortCountries,
  getAllCurrencies,
  getAllLanguages,
  getAllTimezones,
  formatCountry,
  compareCountries,
  validatePostalCode,
  getClosestCountries,
} from "./core/utils";

export type { CountrySummary, CountryStats, SortField, Hemisphere } from "./core/utils";

// Types
export type {
  Country,
  CountryName,
  Currency,
  InternationalDialing,
  Demonym,
  Maps,
  CarInfo,
  FlagUrls,
  PostalCode,
  Region,
  Continent,
  SearchResult,
  SearchOptions,
  FilterOptions,
} from "./types";

export type { CountryGrouping } from "./data/groupings";
