/**
 * One-time script to fetch country data from REST Countries API
 * and store it as a static JSON file.
 *
 * Run: npm run fetch-data
 */

import { writeFileSync } from "fs";
import { join } from "path";

async function fetchData() {
  console.log("Fetching country data from REST Countries API...");

  const response = await fetch("https://restcountries.com/v3.1/all");
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const countries = (await response.json()) as Record<string, unknown>[];

  // Strip translations field to reduce file size (~60% savings)
  const cleaned = countries.map((country) => {
    const { translations, ...rest } = country;
    return rest;
  });

  // Sort alphabetically by alpha-2 code for deterministic output
  cleaned.sort((a, b) => {
    const codeA = (a.cca2 as string) || "";
    const codeB = (b.cca2 as string) || "";
    return codeA.localeCompare(codeB);
  });

  const outputPath = join(__dirname, "..", "src", "data", "countries.json");
  writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), "utf-8");

  console.log(`Wrote ${cleaned.length} countries to ${outputPath}`);
}

fetchData().catch((err) => {
  console.error("Error fetching data:", err);
  process.exit(1);
});
