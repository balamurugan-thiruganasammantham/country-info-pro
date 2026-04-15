import type { Country } from "../types";
import { byAlpha2, byAlpha3, byNumeric, byName, byCapital, byTLD } from "../utils/loader";

/** Common abbreviations/aliases mapped to alpha-2 codes (50+ entries) */
const ALIASES: Record<string, string> = {
  // English-speaking aliases
  uk: "GB",
  england: "GB",
  britain: "GB",
  "great britain": "GB",
  "united kingdom": "GB",
  scotland: "GB",
  wales: "GB",
  usa: "US",
  america: "US",
  "united states": "US",
  "united states of america": "US",
  uae: "AE",
  emirates: "AE",

  // Regional common names
  korea: "KR",
  "south korea": "KR",
  "north korea": "KP",
  russia: "RU",
  "soviet union": "RU",
  taiwan: "TW",
  china: "CN",
  "mainland china": "CN",
  "hong kong": "HK",
  czech: "CZ",
  czechia: "CZ",
  "czech republic": "CZ",
  holland: "NL",
  "the netherlands": "NL",
  netherlands: "NL",

  // Historical / alternate names
  "ivory coast": "CI",
  burma: "MM",
  myanmar: "MM",
  persia: "IR",
  iran: "IR",
  siam: "TH",
  thailand: "TH",
  congo: "CD",
  "dr congo": "CD",
  drc: "CD",
  "east timor": "TL",
  "timor leste": "TL",
  vatican: "VA",
  "holy see": "VA",
  palestine: "PS",
  macedonia: "MK",
  "north macedonia": "MK",
  eswatini: "SZ",
  swaziland: "SZ",
  "cabo verde": "CV",
  "cape verde": "CV",

  // Additional common abbreviations
  rok: "KR",
  dprk: "KP",
  prc: "CN",
  rsa: "ZA",
  "south africa": "ZA",
  ksa: "SA",
  saudi: "SA",
  "saudi arabia": "SA",
  nz: "NZ",
  "new zealand": "NZ",
  "cote divoire": "CI",
  bosnia: "BA",
  trinidad: "TT",
  tobago: "TT",
};

/** Finds a country by its ISO 3166-1 alpha-2 code (e.g., "US", "IN"). Case-insensitive. */
export function getCountryByAlpha2(code: string): Country | undefined {
  return byAlpha2(code);
}

/** Finds a country by its ISO 3166-1 alpha-3 code (e.g., "USA", "IND"). Case-insensitive. */
export function getCountryByAlpha3(code: string): Country | undefined {
  return byAlpha3(code);
}

/** Finds a country by its ISO 3166-1 numeric code (e.g., "840", "356"). */
export function getCountryByNumericCode(code: string): Country | undefined {
  return byNumeric(code);
}

/** Finds a country by exact common or official name. Case-insensitive. */
export function getCountryByName(name: string): Country | undefined {
  return byName(name);
}

/**
 * Smart lookup: auto-detects input type.
 * - 2 characters → alpha-2 code
 * - 3 characters (all letters) → alpha-3 code
 * - 3 characters (all digits) → numeric code
 * - Otherwise → country name
 *
 * Falls back through alternatives if the primary lookup misses.
 */
export function getCountry(input: string): Country | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  // Check aliases first (handles "UK", "USA", "UAE", "Holland", etc.)
  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias) return byAlpha2(alias);

  if (trimmed.length === 2) {
    return byAlpha2(trimmed) ?? byName(trimmed);
  }

  if (trimmed.length === 3) {
    if (/^\d{3}$/.test(trimmed)) {
      return byNumeric(trimmed) ?? byName(trimmed);
    }
    if (/^[A-Za-z]{3}$/.test(trimmed)) {
      return byAlpha3(trimmed) ?? byName(trimmed);
    }
  }

  return byName(trimmed) ?? byAlpha2(trimmed) ?? byAlpha3(trimmed);
}

/** Returns the formatted international dialing code (e.g., "+91" for India). */
export function getPhoneCode(country: Country): string {
  if (!country.idd?.root) return "";
  if (country.idd.suffixes.length === 1) {
    return country.idd.root + country.idd.suffixes[0];
  }
  // For countries with many suffixes (US/CA), return root only
  return country.idd.root;
}

/** Returns the primary currency info, or undefined if none. */
export function getCurrencyInfo(
  country: Country
): { code: string; name: string; symbol: string } | undefined {
  const entries = Object.entries(country.currencies);
  if (entries.length === 0) return undefined;
  const [code, info] = entries[0];
  return { code, ...info };
}

/** Checks whether a string is a valid ISO 3166-1 alpha-2 or alpha-3 code. */
export function isValidCountryCode(code: string): boolean {
  const trimmed = code.trim();
  if (trimmed.length === 2) return byAlpha2(trimmed) !== undefined;
  if (trimmed.length === 3 && /^[A-Za-z]{3}$/.test(trimmed)) {
    return byAlpha3(trimmed) !== undefined;
  }
  return false;
}

/** Finds a country by its capital city name (e.g., "Tokyo", "New Delhi"). Case-insensitive. O(1). */
export function getCountryByCapital(capital: string): Country | undefined {
  const trimmed = capital.trim();
  if (!trimmed) return undefined;
  return byCapital(trimmed);
}

/** Finds a country by top-level domain (e.g., ".in", ".uk", "de"). Case-insensitive. O(1). */
export function getCountryByTLD(tld: string): Country | undefined {
  const trimmed = tld.trim();
  if (!trimmed) return undefined;
  return byTLD(trimmed);
}
