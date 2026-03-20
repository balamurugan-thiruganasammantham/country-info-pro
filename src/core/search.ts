import type { Country, SearchResult, SearchOptions } from "../types";
import { getAll } from "../utils/loader";
import { normalize } from "../utils/normalize";
import { fuzzyScore } from "../utils/fuzzy";

interface FieldConfig {
  weight: number;
  extract: (country: Country) => string[];
  label: string;
  minQueryLen?: number;
}

const SEARCH_FIELDS: FieldConfig[] = [
  {
    weight: 1.0,
    extract: (c) => [c.name.common],
    label: "name.common",
  },
  {
    weight: 0.9,
    extract: (c) => [c.name.official],
    label: "name.official",
  },
  {
    weight: 0.95,
    extract: (c) => [c.cca2],
    label: "cca2",
    minQueryLen: 2,
  },
  {
    weight: 0.95,
    extract: (c) => [c.cca3],
    label: "cca3",
    minQueryLen: 2,
  },
  {
    weight: 0.8,
    extract: (c) => c.altSpellings,
    label: "altSpellings",
  },
  {
    weight: 0.7,
    extract: (c) => c.capital,
    label: "capital",
  },
  {
    weight: 0.75,
    extract: (c) => {
      const demonyms = c.demonyms?.eng;
      if (!demonyms) return [];
      return [demonyms.m, demonyms.f].filter(Boolean);
    },
    label: "demonym",
  },
  {
    weight: 0.65,
    extract: (c) => {
      const names: string[] = [];
      for (const cur of Object.values(c.currencies)) {
        if (cur.name) {
          names.push(cur.name);
          // Also add individual words for better partial matching
          // ("rupee" should match "Indian rupee")
          for (const word of cur.name.split(/\s+/)) {
            if (word.length >= 3) names.push(word);
          }
        }
      }
      return names;
    },
    label: "currency",
    minQueryLen: 3,
  },
];

export function searchCountries(
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { limit = 10, threshold = 0.3 } = options;
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = normalize(trimmed);
  const countries = getAll();
  const results: SearchResult[] = [];

  for (const country of countries) {
    let bestScore = 0;
    let bestField = "";

    for (const field of SEARCH_FIELDS) {
      if (field.minQueryLen && normalizedQuery.length < field.minQueryLen) {
        continue;
      }

      const values = field.extract(country);
      for (const value of values) {
        if (!value) continue;
        const normalizedValue = normalize(value);
        const score = fuzzyScore(normalizedQuery, normalizedValue) * field.weight;
        if (score > bestScore) {
          bestScore = score;
          bestField = field.label;
        }
        // Early exit: perfect match on this country, no need to check more fields
        if (bestScore >= 1.0) break;
      }
      if (bestScore >= 1.0) break;
    }

    if (bestScore >= threshold) {
      results.push({
        country,
        score: bestScore,
        matchedOn: bestField,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/** Returns the single best matching country, or undefined if no match meets threshold. */
export function searchCountry(
  query: string,
  options: SearchOptions = {}
): Country | undefined {
  const results = searchCountries(query, { ...options, limit: 1 });
  return results.length > 0 ? results[0].country : undefined;
}
