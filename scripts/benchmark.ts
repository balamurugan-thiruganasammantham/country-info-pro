/**
 * Performance benchmarks for country-info-pro.
 * Run: npx tsx scripts/benchmark.ts
 */

import {
  getCountry,
  getCountryByAlpha2,
  getCountryByCapital,
  searchCountries,
  searchCountry,
  getCountriesByRegion,
  getCountriesByLanguage,
  filterCountries,
  getAllCountries,
  getCountriesByGrouping,
  getGroupings,
} from "../src";

function bench(name: string, fn: () => void, iterations = 10000): void {
  // Warmup
  for (let i = 0; i < 100; i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const elapsed = performance.now() - start;

  const opsPerSec = Math.round((iterations / elapsed) * 1000);
  const avgUs = ((elapsed / iterations) * 1000).toFixed(2);
  console.log(`  ${name}: ${avgUs}µs/op (${opsPerSec.toLocaleString()} ops/sec)`);
}

console.log("=== country-info-pro benchmarks ===\n");

console.log("Lookups (O(1) indexed):");
bench("getCountry('IN')", () => getCountry("IN"));
bench("getCountry('USA')", () => getCountry("USA"));
bench("getCountry('India')", () => getCountry("India"));
bench("getCountry('UK') [alias]", () => getCountry("UK"));
bench("getCountryByAlpha2('US')", () => getCountryByAlpha2("US"));
bench("getCountryByCapital('Tokyo')", () => getCountryByCapital("Tokyo"));

console.log("\nSearch (O(n) fuzzy):");
bench("searchCountry('ind')", () => searchCountry("ind"), 1000);
bench("searchCountries('Frence')", () => searchCountries("Frence"), 1000);
bench("searchCountries('united', limit:5)", () => searchCountries("united", { limit: 5 }), 1000);
bench("searchCountries('dollar')", () => searchCountries("dollar"), 1000);

console.log("\nFilters:");
bench("getCountriesByRegion('Europe')", () => getCountriesByRegion("Europe"));
bench("getCountriesByLanguage('English')", () => getCountriesByLanguage("English"));
bench("filterCountries({region,language})", () =>
  filterCountries({ region: "Europe", language: "French" })
);
bench("getCountriesByGrouping('EU')", () => getCountriesByGrouping("EU"));
bench("getGroupings(india)", () => getGroupings(getCountry("IN")!));

console.log("\nBulk:");
bench("getAllCountries()", () => getAllCountries());

console.log("\nStartup (cold load):");
const startCold = performance.now();
// Dynamic import to measure cold load
const coldCountry = getCountry("IN");
const coldElapsed = performance.now() - startCold;
console.log(`  First call: ${coldElapsed.toFixed(2)}ms (already warmed by benchmarks)`);
console.log(`  Note: actual cold start is measured before any calls above`);
