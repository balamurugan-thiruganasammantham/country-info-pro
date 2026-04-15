import type { Country } from "../types";
import { normalize } from "./normalize";
import countriesData from "../data/countries.json";

/** Pre-extracted and normalized search fields for a single country. */
export interface SearchIndex {
  country: Country;
  commonName: string;
  officialName: string;
  cca2: string;
  cca3: string;
  altSpellings: string[];
  capitals: string[];
  demonyms: string[];
  currencyNames: string[];
}

let countries: Country[] | null = null;
let alpha2Map: Map<string, Country> | null = null;
let alpha3Map: Map<string, Country> | null = null;
let numericMap: Map<string, Country> | null = null;
let nameMap: Map<string, Country> | null = null;
let capitalMap: Map<string, Country> | null = null;
let tldMap: Map<string, Country> | null = null;
let searchIndex: SearchIndex[] | null = null;

function ensureLoaded(): void {
  if (countries !== null) return;

  countries = countriesData as unknown as Country[];
  alpha2Map = new Map();
  alpha3Map = new Map();
  numericMap = new Map();
  nameMap = new Map();
  capitalMap = new Map();
  tldMap = new Map();
  searchIndex = [];

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

    // Pre-extract and normalize search fields once
    const demonyms = country.demonyms?.eng;
    const demonymList: string[] = [];
    if (demonyms) {
      if (demonyms.m) demonymList.push(normalize(demonyms.m));
      if (demonyms.f && demonyms.f !== demonyms.m) demonymList.push(normalize(demonyms.f));
    }

    const currencyNames: string[] = [];
    for (const cur of Object.values(country.currencies)) {
      if (cur.name) {
        currencyNames.push(normalize(cur.name));
        for (const word of cur.name.split(/\s+/)) {
          if (word.length >= 3) currencyNames.push(normalize(word));
        }
      }
    }

    searchIndex.push({
      country,
      commonName: normalize(country.name.common),
      officialName: normalize(country.name.official),
      cca2: normalize(country.cca2),
      cca3: normalize(country.cca3),
      altSpellings: country.altSpellings.map(normalize),
      capitals: country.capital.map(normalize),
      demonyms: demonymList,
      currencyNames,
    });
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

export function getSearchIndex(): SearchIndex[] {
  ensureLoaded();
  return searchIndex!;
}
