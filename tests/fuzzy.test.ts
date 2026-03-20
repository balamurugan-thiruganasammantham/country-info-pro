import { describe, it, expect } from "vitest";
import { levenshtein, fuzzyScore } from "../src/utils/fuzzy";
import { normalize } from "../src/utils/normalize";

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
  });

  it("returns length of other string when one is empty", () => {
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
  });

  it("computes distance correctly", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("saturday", "sunday")).toBe(3);
  });

  it("respects maxDistance for early termination", () => {
    const dist = levenshtein("abc", "xyz", 1);
    expect(dist).toBeGreaterThan(1);
  });

  it("handles single character strings", () => {
    expect(levenshtein("a", "b")).toBe(1);
    expect(levenshtein("a", "a")).toBe(0);
  });
});

describe("fuzzyScore", () => {
  it("returns 1.0 for exact match", () => {
    expect(fuzzyScore("india", "india")).toBe(1.0);
  });

  it("returns high score for prefix match", () => {
    const score = fuzzyScore("ind", "india");
    expect(score).toBeGreaterThan(0.9);
  });

  it("returns moderate score for substring match", () => {
    const score = fuzzyScore("dia", "india");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(0.9);
  });

  it("returns 0 for empty strings", () => {
    expect(fuzzyScore("", "india")).toBe(0);
    expect(fuzzyScore("india", "")).toBe(0);
  });

  it("handles typos via levenshtein", () => {
    const score = fuzzyScore("frence", "france");
    expect(score).toBeGreaterThan(0.3);
  });
});

describe("normalize", () => {
  it("lowercases input", () => {
    expect(normalize("INDIA")).toBe("india");
  });

  it("strips diacritics", () => {
    expect(normalize("Réunion")).toBe("reunion");
    expect(normalize("Côte d'Ivoire")).toBe("cote d'ivoire");
  });

  it("trims whitespace", () => {
    expect(normalize("  india  ")).toBe("india");
  });
});
