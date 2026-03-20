import type { Country, Region, Continent, FilterOptions } from "../types";
import { getAll, byAlpha2, byAlpha3 } from "../utils/loader";
import { GROUPINGS, type CountryGrouping } from "../data/groupings";

/** Returns all countries in a given region (e.g., "Europe", "Asia"). */
export function getCountriesByRegion(region: Region): Country[] {
  return getAll().filter((c) => c.region === region);
}

/** Returns all countries on a given continent (e.g., "North America", "Africa"). */
export function getCountriesByContinent(continent: Continent): Country[] {
  return getAll().filter((c) => c.continents.includes(continent));
}

/** Returns countries where the given language is spoken. Accepts language name or ISO 639 code. */
export function getCountriesByLanguage(language: string): Country[] {
  const lang = language.toLowerCase();
  return getAll().filter((c) =>
    Object.entries(c.languages).some(
      ([code, name]) =>
        code.toLowerCase() === lang || name.toLowerCase() === lang
    )
  );
}

/** Returns countries using the given currency code (e.g., "EUR", "USD"). Case-insensitive. */
export function getCountriesByCurrency(currencyCode: string): Country[] {
  const code = currencyCode.toUpperCase();
  return getAll().filter((c) => code in c.currencies);
}

/** Returns countries matching a calling code (e.g., "+91", "+1"). */
export function getCountriesByCallingCode(callingCode: string): Country[] {
  const cleaned = callingCode.replace(/[^0-9+]/g, "");
  return getAll().filter((c) => {
    if (!c.idd?.root) return false;
    if (c.idd.root === cleaned) return true;
    for (const suffix of c.idd.suffixes) {
      if (c.idd.root + suffix === cleaned) return true;
    }
    return false;
  });
}

/** Filters countries by multiple criteria. All specified conditions must match. */
export function filterCountries(options: FilterOptions): Country[] {
  return getAll().filter((c) => {
    if (options.region && c.region !== options.region) return false;
    if (options.subregion && c.subregion !== options.subregion) return false;
    if (options.continent && !c.continents.includes(options.continent))
      return false;
    if (options.language) {
      const lang = options.language.toLowerCase();
      const hasLang = Object.entries(c.languages).some(
        ([code, name]) =>
          code.toLowerCase() === lang || name.toLowerCase() === lang
      );
      if (!hasLang) return false;
    }
    if (options.currency) {
      if (!(options.currency.toUpperCase() in c.currencies)) return false;
    }
    if (options.independent !== undefined && c.independent !== options.independent)
      return false;
    if (options.unMember !== undefined && c.unMember !== options.unMember)
      return false;
    if (options.landlocked !== undefined && c.landlocked !== options.landlocked)
      return false;
    return true;
  });
}

/** Returns all 250 countries. */
export function getAllCountries(): Country[] {
  return getAll();
}

/** Returns bordering countries as full Country objects. */
export function getNeighbors(country: Country): Country[] {
  return country.borders
    .map((code) => byAlpha3(code))
    .filter((c): c is Country => c !== undefined);
}

/** Returns member countries of a political/economic grouping (e.g., "EU", "NATO", "G7"). */
export function getCountriesByGrouping(grouping: CountryGrouping): Country[] {
  const codes = GROUPINGS[grouping];
  if (!codes) return [];
  return codes
    .map((code) => byAlpha2(code))
    .filter((c): c is Country => c !== undefined);
}

/** Returns all groupings that a country belongs to. */
export function getGroupings(country: Country): CountryGrouping[] {
  const code = country.cca2;
  return (Object.keys(GROUPINGS) as CountryGrouping[]).filter((g) =>
    (GROUPINGS[g] as readonly string[]).includes(code)
  );
}

/** Returns all available grouping names. */
export function getAvailableGroupings(): CountryGrouping[] {
  return Object.keys(GROUPINGS) as CountryGrouping[];
}

/** Returns countries in a given subregion (e.g., "Southern Asia", "Western Europe"). */
export function getCountriesBySubregion(subregion: string): Country[] {
  const lower = subregion.toLowerCase();
  return getAll().filter((c) => c.subregion.toLowerCase() === lower);
}

/** Returns countries by their start-of-week day (e.g., "monday", "sunday"). */
export function getCountriesByStartOfWeek(day: string): Country[] {
  const lower = day.toLowerCase();
  return getAll().filter((c) => c.startOfWeek === lower);
}
