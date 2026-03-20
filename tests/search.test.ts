import { describe, it, expect } from "vitest";
import { searchCountries } from "../src";

describe("searchCountries", () => {
  it("finds France with partial query", () => {
    const results = searchCountries("Franc");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].country.name.common).toBe("France");
  });

  it("finds United States with prefix", () => {
    const results = searchCountries("United");
    const names = results.map((r) => r.country.name.common);
    expect(names).toContain("United States");
  });

  it("handles fuzzy match with typo", () => {
    const results = searchCountries("Frence");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].country.name.common).toBe("France");
  });

  it("returns empty array for empty query", () => {
    expect(searchCountries("")).toEqual([]);
  });

  it("respects limit option", () => {
    const results = searchCountries("an", { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("respects threshold option", () => {
    const results = searchCountries("xyz", { threshold: 0.9 });
    expect(results.length).toBe(0);
  });

  it("results are sorted by score descending", () => {
    const results = searchCountries("ind");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("search results include matchedOn field", () => {
    const results = searchCountries("India");
    expect(results[0].matchedOn).toBeDefined();
    expect(typeof results[0].matchedOn).toBe("string");
  });

  it("is case-insensitive", () => {
    const upper = searchCountries("INDIA");
    const lower = searchCountries("india");
    expect(upper[0].country.cca2).toBe(lower[0].country.cca2);
  });

  it("finds by capital name", () => {
    const results = searchCountries("New Delhi");
    const names = results.map((r) => r.country.name.common);
    expect(names).toContain("India");
  });

  it("finds by demonym", () => {
    const results = searchCountries("American");
    const names = results.map((r) => r.country.name.common);
    expect(names).toContain("United States");
  });

  it("finds by currency name", () => {
    const results = searchCountries("rupee", { limit: 20 });
    const names = results.map((r) => r.country.name.common);
    expect(names).toContain("India");
  });

  it("finds multiple countries by currency name", () => {
    const results = searchCountries("dollar", { limit: 20 });
    expect(results.length).toBeGreaterThan(3);
  });
});
