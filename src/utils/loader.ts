import type { Country } from "../types";
import countriesData from "../data/countries.json";

let countries: Country[] | null = null;
let alpha2Map: Map<string, Country> | null = null;
let alpha3Map: Map<string, Country> | null = null;
let numericMap: Map<string, Country> | null = null;
let nameMap: Map<string, Country> | null = null;
let capitalMap: Map<string, Country> | null = null;
let tldMap: Map<string, Country> | null = null;

function ensureLoaded(): void {
  if (countries !== null) return;

  countries = countriesData as unknown as Country[];
  alpha2Map = new Map();
  alpha3Map = new Map();
  numericMap = new Map();
  nameMap = new Map();
  capitalMap = new Map();
  tldMap = new Map();

  for (const country of countries) {
    if (country.cca2) {
      alpha2Map.set(country.cca2.toUpperCase(), country);
    }
    if (country.cca3) {
      alpha3Map.set(country.cca3.toUpperCase(), country);
    }
    if (country.ccn3) {
      numericMap.set(country.ccn3, country);
    }
    if (country.name?.common) {
      nameMap.set(country.name.common.toLowerCase(), country);
    }
    if (country.name?.official) {
      nameMap.set(country.name.official.toLowerCase(), country);
    }
    for (const cap of country.capital) {
      capitalMap.set(cap.toLowerCase(), country);
    }
    for (const domain of country.tld) {
      tldMap.set(domain.toLowerCase(), country);
    }
  }
}

export function getAll(): Country[] {
  ensureLoaded();
  return countries!;
}

export function byAlpha2(code: string): Country | undefined {
  ensureLoaded();
  return alpha2Map!.get(code.toUpperCase());
}

export function byAlpha3(code: string): Country | undefined {
  ensureLoaded();
  return alpha3Map!.get(code.toUpperCase());
}

export function byNumeric(code: string): Country | undefined {
  ensureLoaded();
  return numericMap!.get(code);
}

export function byName(name: string): Country | undefined {
  ensureLoaded();
  return nameMap!.get(name.toLowerCase());
}

export function byCapital(capital: string): Country | undefined {
  ensureLoaded();
  return capitalMap!.get(capital.toLowerCase());
}

export function byTLD(tld: string): Country | undefined {
  ensureLoaded();
  const normalized = tld.startsWith(".") ? tld.toLowerCase() : "." + tld.toLowerCase();
  return tldMap!.get(normalized);
}
