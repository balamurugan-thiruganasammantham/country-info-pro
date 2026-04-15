import type { Country } from "../types";
import { getAll, byAlpha2, byAlpha3, byNumeric, byName } from "../utils/loader";

/**
 * Generates an emoji flag from a country's alpha-2 code.
 * Uses Unicode Regional Indicator Symbols: each letter A-Z maps to 🇦-🇿.
 */
export function toEmojiFlag(cca2: string): string {
  const code = cca2.toUpperCase();
  if (code.length !== 2) return "";
  return String.fromCodePoint(
    0x1f1e6 + code.charCodeAt(0) - 65,
    0x1f1e6 + code.charCodeAt(1) - 65
  );
}

/**
 * Calculates the distance between two countries in kilometers using the Haversine formula.
 * Uses each country's latlng center point.
 */
export function getDistance(countryA: Country, countryB: Country): number {
  const [lat1, lon1] = countryA.latlng;
  const [lat2, lon2] = countryB.latlng;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns a random country. Optionally filter by a predicate.
 */
export function getRandomCountry(filter?: (country: Country) => boolean): Country {
  const pool = filter ? getAll().filter(filter) : getAll();
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Compares two countries side-by-side, returning a structured diff object.
 */
export function compareCountries(
  a: Country,
  b: Country
): Record<string, { a: unknown; b: unknown }> {
  return {
    name: { a: a.name.common, b: b.name.common },
    capital: { a: a.capital[0] ?? "N/A", b: b.capital[0] ?? "N/A" },
    population: { a: a.population, b: b.population },
    area: { a: a.area, b: b.area },
    region: { a: a.region, b: b.region },
    subregion: { a: a.subregion, b: b.subregion },
    languages: {
      a: Object.values(a.languages).join(", "),
      b: Object.values(b.languages).join(", "),
    },
    currencies: {
      a: Object.values(a.currencies).map((c) => c.name).join(", "),
      b: Object.values(b.currencies).map((c) => c.name).join(", "),
    },
    timezones: {
      a: a.timezones.join(", "),
      b: b.timezones.join(", "),
    },
    drivingSide: { a: a.car.side, b: b.car.side },
    landlocked: { a: a.landlocked, b: b.landlocked },
    independent: { a: a.independent, b: b.independent },
  };
}

/**
 * Validates a postal code string against a country's postal code regex pattern.
 * Returns true if valid, false if invalid or country has no postal code format.
 */
export function validatePostalCode(country: Country, postalCode: string): boolean {
  if (!country.postalCode?.regex) return false;
  try {
    return new RegExp(country.postalCode.regex).test(postalCode.trim());
  } catch {
    return false;
  }
}

/**
 * Returns the closest N countries to a given country by geographic distance.
 */
export function getClosestCountries(
  country: Country,
  count: number = 5
): Array<{ country: Country; distance: number }> {
  const all = getAll();
  const distances = all
    .filter((c) => c.cca2 !== country.cca2)
    .map((c) => ({
      country: c,
      distance: Math.round(getDistance(country, c)),
    }));

  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, count);
}

/**
 * Returns N random countries. Optionally filter by a predicate.
 * If n exceeds available countries, returns all matching countries (shuffled).
 */
export function getRandomCountries(
  count: number,
  filter?: (country: Country) => boolean
): Country[] {
  const pool = filter ? getAll().filter(filter) : [...getAll()];
  const n = Math.min(count, pool.length);
  // Fisher-Yates shuffle (partial — only shuffle first n elements)
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/**
 * Returns countries with population in the given range (inclusive).
 * Omit min or max for open-ended ranges.
 */
export function getCountriesByPopulation(
  min?: number,
  max?: number
): Country[] {
  return getAll().filter((c) => {
    if (min !== undefined && c.population < min) return false;
    if (max !== undefined && c.population > max) return false;
    return true;
  });
}

/**
 * Returns countries with area (km²) in the given range (inclusive).
 * Omit min or max for open-ended ranges.
 */
export function getCountriesByArea(
  min?: number,
  max?: number
): Country[] {
  return getAll().filter((c) => {
    if (min !== undefined && c.area < min) return false;
    if (max !== undefined && c.area > max) return false;
    return true;
  });
}

/** Valid sort fields for sortCountries(). */
export type SortField = "name" | "population" | "area" | "capital" | "region";

/**
 * Sorts an array of countries by a given field.
 * Returns a new sorted array (does not mutate the original).
 */
export function sortCountries(
  countries: Country[],
  field: SortField = "name",
  order: "asc" | "desc" = "asc"
): Country[] {
  const sorted = [...countries];
  const dir = order === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (field) {
      case "name":
        return dir * a.name.common.localeCompare(b.name.common);
      case "population":
        return dir * (a.population - b.population);
      case "area":
        return dir * (a.area - b.area);
      case "capital":
        return dir * (a.capital[0] ?? "").localeCompare(b.capital[0] ?? "");
      case "region":
        return dir * a.region.localeCompare(b.region);
      default:
        return 0;
    }
  });

  return sorted;
}

/**
 * Returns countries with exactly the specified number of land borders.
 * Use 0 for island nations, 1+ for specific border counts.
 */
export function getCountriesByBorderCount(count: number): Country[] {
  return getAll().filter((c) => c.borders.length === count);
}

/**
 * Returns all unique currencies used across all countries.
 * Each entry includes the currency code, name, symbol, and list of countries using it.
 */
export function getAllCurrencies(): Array<{
  code: string;
  name: string;
  symbol: string;
  countries: string[];
}> {
  const map = new Map<string, { name: string; symbol: string; countries: string[] }>();
  for (const c of getAll()) {
    for (const [code, info] of Object.entries(c.currencies)) {
      if (!map.has(code)) {
        map.set(code, { name: info.name, symbol: info.symbol, countries: [] });
      }
      map.get(code)!.countries.push(c.cca2);
    }
  }
  return Array.from(map.entries())
    .map(([code, info]) => ({ code, ...info }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Returns all unique languages spoken across all countries.
 * Each entry includes the ISO 639 code, language name, and list of countries.
 */
export function getAllLanguages(): Array<{
  code: string;
  name: string;
  countries: string[];
}> {
  const map = new Map<string, { name: string; countries: string[] }>();
  for (const c of getAll()) {
    for (const [code, name] of Object.entries(c.languages)) {
      if (!map.has(code)) {
        map.set(code, { name, countries: [] });
      }
      map.get(code)!.countries.push(c.cca2);
    }
  }
  return Array.from(map.entries())
    .map(([code, info]) => ({ code, ...info }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns all unique timezones across all countries with their associated countries.
 */
export function getAllTimezones(): Array<{
  timezone: string;
  countries: string[];
}> {
  const map = new Map<string, string[]>();
  for (const c of getAll()) {
    for (const tz of c.timezones) {
      if (!map.has(tz)) map.set(tz, []);
      map.get(tz)!.push(c.cca2);
    }
  }
  return Array.from(map.entries())
    .map(([timezone, countries]) => ({ timezone, countries }))
    .sort((a, b) => a.timezone.localeCompare(b.timezone));
}

export type Hemisphere = "northern" | "southern" | "eastern" | "western";

/**
 * Returns countries located in a given hemisphere based on their latlng center point.
 * - "northern": latitude >= 0
 * - "southern": latitude < 0
 * - "eastern": longitude >= 0
 * - "western": longitude < 0
 */
export function getCountriesByHemisphere(hemisphere: Hemisphere): Country[] {
  return getAll().filter((c) => {
    const [lat, lon] = c.latlng;
    switch (hemisphere) {
      case "northern": return lat >= 0;
      case "southern": return lat < 0;
      case "eastern": return lon >= 0;
      case "western": return lon < 0;
    }
  });
}

/**
 * Normalizes any country input (name, alpha-2, alpha-3, numeric, alias) to an ISO 3166-1 alpha-2 code.
 * Accepts: country name, alpha-2, alpha-3, or numeric code.
 * Returns undefined if no country matches.
 */
export function toCountryCode(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const lower = trimmed.toLowerCase();

  // Try alpha-2
  const a2 = byAlpha2(trimmed);
  if (a2) return a2.cca2;

  // Try alpha-3
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    const a3 = byAlpha3(trimmed);
    if (a3) return a3.cca2;
  }

  // Try numeric
  if (/^\d{3}$/.test(trimmed)) {
    const num = byNumeric(trimmed);
    if (num) return num.cca2;
  }

  // Try name
  const named = byName(trimmed);
  if (named) return named.cca2;

  return undefined;
}

/** Aggregate statistics about the entire country dataset. */
export interface CountryStats {
  totalCountries: number;
  totalPopulation: number;
  totalArea: number;
  averagePopulation: number;
  averageArea: number;
  mostPopulous: { name: string; population: number };
  leastPopulous: { name: string; population: number };
  largest: { name: string; area: number };
  smallest: { name: string; area: number };
  mostLanguages: { name: string; count: number };
  mostBorders: { name: string; count: number };
  totalLanguages: number;
  totalCurrencies: number;
  totalTimezones: number;
}

/**
 * Returns aggregate statistics about the entire 250-country dataset.
 */
export function getCountryStats(): CountryStats {
  const all = getAll();

  let totalPop = 0;
  let totalArea = 0;
  let mostPop = all[0];
  let leastPop = all[0];
  let largest = all[0];
  let smallest = all[0];
  let mostLangs = all[0];
  let mostBords = all[0];
  const langSet = new Set<string>();
  const curSet = new Set<string>();
  const tzSet = new Set<string>();

  for (const c of all) {
    totalPop += c.population;
    totalArea += c.area;
    if (c.population > mostPop.population) mostPop = c;
    if (c.population > 0 && (leastPop.population === 0 || c.population < leastPop.population)) leastPop = c;
    if (c.area > largest.area) largest = c;
    if (c.area > 0 && (smallest.area === 0 || c.area < smallest.area)) smallest = c;
    if (Object.keys(c.languages).length > Object.keys(mostLangs.languages).length) mostLangs = c;
    if (c.borders.length > mostBords.borders.length) mostBords = c;
    for (const code of Object.keys(c.languages)) langSet.add(code);
    for (const code of Object.keys(c.currencies)) curSet.add(code);
    for (const tz of c.timezones) tzSet.add(tz);
  }

  return {
    totalCountries: all.length,
    totalPopulation: totalPop,
    totalArea: Math.round(totalArea),
    averagePopulation: Math.round(totalPop / all.length),
    averageArea: Math.round(totalArea / all.length),
    mostPopulous: { name: mostPop.name.common, population: mostPop.population },
    leastPopulous: { name: leastPop.name.common, population: leastPop.population },
    largest: { name: largest.name.common, area: largest.area },
    smallest: { name: smallest.name.common, area: smallest.area },
    mostLanguages: { name: mostLangs.name.common, count: Object.keys(mostLangs.languages).length },
    mostBorders: { name: mostBords.name.common, count: mostBords.borders.length },
    totalLanguages: langSet.size,
    totalCurrencies: curSet.size,
    totalTimezones: tzSet.size,
  };
}

/** Simplified country summary for common use cases. */
export interface CountrySummary {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  numericCode: string;
  capital: string;
  region: string;
  subregion: string;
  continent: string;
  population: number;
  area: number;
  currency: { code: string; name: string; symbol: string } | null;
  phoneCode: string;
  flag: string;
  flagUrl: string;
  mapUrl: string;
  languages: string[];
  timezones: string[];
  borders: string[];
  drivingSide: string;
  tld: string;
  landlocked: boolean;
  independent: boolean | null;
  latlng: [number, number];
}

/**
 * Returns a simplified flat object with the most commonly needed country fields.
 * Useful for APIs, forms, and display purposes.
 */
export function formatCountry(country: Country): CountrySummary {
  const currencyEntries = Object.entries(country.currencies);
  const currency = currencyEntries.length > 0
    ? { code: currencyEntries[0][0], ...currencyEntries[0][1] }
    : null;

  let phoneCode = "";
  if (country.idd?.root) {
    phoneCode = country.idd.suffixes.length === 1
      ? country.idd.root + country.idd.suffixes[0]
      : country.idd.root;
  }

  return {
    name: country.name.common,
    officialName: country.name.official,
    iso2: country.cca2,
    iso3: country.cca3,
    numericCode: country.ccn3,
    capital: country.capital[0] ?? "",
    region: country.region,
    subregion: country.subregion,
    continent: country.continents[0] ?? "",
    population: country.population,
    area: country.area,
    currency,
    phoneCode,
    flag: country.flag,
    flagUrl: country.flags.svg,
    mapUrl: country.maps.googleMaps,
    languages: Object.values(country.languages),
    timezones: country.timezones,
    borders: country.borders,
    drivingSide: country.car.side,
    tld: country.tld[0] ?? "",
    landlocked: country.landlocked,
    independent: country.independent,
    latlng: country.latlng,
  };
}
