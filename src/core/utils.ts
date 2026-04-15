import type { Country } from "../types";
import { getAll } from "../utils/loader";

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
