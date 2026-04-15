import type { Country, SearchResult, SearchOptions } from "../types";
import { getSearchIndex } from "../utils/loader";
import { normalize } from "../utils/normalize";
import { fuzzyScore } from "../utils/fuzzy";

interface FieldConfig {
  weight: number;
  extract: (idx: import("../utils/loader").SearchIndex) => string[];
  label: string;
  minQueryLen?: number;
}

const SEARCH_FIELDS: FieldConfig[] = [
  {
    weight: 1.0,
    extract: (idx) => [idx.commonName],
    label: "name.common",
  },
  {
    weight: 0.9,
    extract: (idx) => [idx.officialName],
    label: "name.official",
  },
  {
    weight: 0.95,
    extract: (idx) => [idx.cca2],
    label: "cca2",
    minQueryLen: 2,
  },
  {
    weight: 0.95,
    extract: (idx) => [idx.cca3],
    label: "cca3",
    minQueryLen: 2,
  },
  {
    weight: 0.8,
    extract: (idx) => idx.altSpellings,
    label: "altSpellings",
  },
  {
    weight: 0.7,
    extract: (idx) => idx.capitals,
    label: "capital",
  },
  {
    weight: 0.75,
    extract: (idx) => idx.demonyms,
    label: "demonym",
  },
  {
    weight: 0.65,
    extract: (idx) => idx.currencyNames,
    label: "currency",
    minQueryLen: 3,
  },
];

/** Fuzzy search across country names, codes, capitals, demonyms, and currencies. Returns scored results. */
export function searchCountries(
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { limit = 10, threshold = 0.3 } = options;
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = normalize(trimmed);
  const index = getSearchIndex();
  const results: SearchResult[] = [];

  for (const entry of index) {
    let bestScore = 0;
    let bestField = "";

    for (const field of SEARCH_FIELDS) {
      if (field.minQueryLen && normalizedQuery.length < field.minQueryLen) {
        continue;
      }

      const values = field.extract(entry);
      for (const value of values) {
        if (!value) continue;
        // Values are already normalized during data load
        const score = fuzzyScore(normalizedQuery, value) * field.weight;
        if (score > bestScore) {
          bestScore = score;
          bestField = field.label;
        }
        if (bestScore >= 1.0) break;
      }
      if (bestScore >= 1.0) break;
    }

    if (bestScore >= threshold) {
      results.push({
        country: entry.country,
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
